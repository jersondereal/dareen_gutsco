const db = require('../config/database');

// Cash-in operation
exports.cashIn = (req, res) => {
  const { RFID, amount } = req.body;
  const query = 'UPDATE Passenger SET CurrentBalance = CurrentBalance + ? WHERE RFID = ?';
  db.query(query, [amount, RFID], (err, result) => {
    if (err) return res.status(500).send(err);
    const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, RemainingBalance) VALUES (?, "Cash-in", ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
    db.query(transactionQuery, [RFID, amount, RFID], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send('Cash-in successful');
    });
  });
};

// Process travel payment
exports.processTravel = (req, res) => {
  const { RFID, destination, fare } = req.body;
  const query = 'UPDATE Passenger SET CurrentBalance = CurrentBalance - ? WHERE RFID = ? AND CurrentBalance >= ?';
  db.query(query, [fare, RFID, fare], (err, result) => {
    if (err || result.affectedRows === 0) return res.status(400).send('Insufficient balance or invalid RFID');
    const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, Destination, Fare, RemainingBalance) VALUES (?, "Payment", ?, ?, ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
    db.query(transactionQuery, [RFID, fare, destination, fare, RFID], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send('Travel payment processed successfully');
    });
  });
};

// Get all transactions
exports.getTransactions = (req, res) => {
  const query = 'SELECT * FROM Transactions ORDER BY Timestamp DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Delete a transaction
exports.deleteTransaction = (req, res) => {
  const { id } = req.params;

  // First get the transaction details
  const getTransactionQuery = 'SELECT * FROM Transactions WHERE TransactionID = ?';
  db.query(getTransactionQuery, [id], (err, transactions) => {
    if (err) {
      console.error('Error fetching transaction:', err);
      return res.status(500).json({ message: 'Failed to delete transaction' });
    }
    
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transactions[0];

    // If it's a cash-in transaction, update the passenger's balance
    if (transaction.TransactionType === 'Cash-in') {
      const updateBalanceQuery = 'UPDATE Passenger SET CurrentBalance = CurrentBalance - ? WHERE RFID = ?';
      db.query(updateBalanceQuery, [transaction.Amount, transaction.RFID], (err, result) => {
        if (err) {
          console.error('Error updating balance:', err);
          return res.status(500).json({ message: 'Failed to update balance' });
        }

        // After updating balance, delete the transaction
        const deleteQuery = 'DELETE FROM Transactions WHERE TransactionID = ?';
        db.query(deleteQuery, [id], (err, result) => {
          if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).json({ message: 'Failed to delete transaction' });
          }
          res.status(200).json({ message: 'Transaction deleted and balance updated successfully' });
        });
      });
    } else {
      // If it's not a cash-in transaction, just delete it
      const deleteQuery = 'DELETE FROM Transactions WHERE TransactionID = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('Error deleting transaction:', err);
          return res.status(500).json({ message: 'Failed to delete transaction' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
      });
    }
  });
};
