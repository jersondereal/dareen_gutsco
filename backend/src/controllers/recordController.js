const db = require('../config/database');

// Cash-in operation
exports.cashIn = (req, res) => {
  const { RFID, amount } = req.body;
  
  // Validate input
  if (!RFID || !amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ message: 'Invalid RFID or amount' });
  }

  const parsedAmount = parseFloat(amount);
  
  const query = 'UPDATE Passenger SET CurrentBalance = CurrentBalance + ? WHERE RFID = ?';
  db.query(query, [parsedAmount, RFID], (err, result) => {
    if (err) {
      console.error('Cash-in error:', err);
      return res.status(500).json({ message: 'Database error during cash-in' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, RemainingBalance) VALUES (?, "Cash-in", ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
    db.query(transactionQuery, [RFID, parsedAmount, RFID], (err, result) => {
      if (err) {
        console.error('Transaction record error:', err);
        return res.status(500).json({ message: 'Failed to record transaction' });
      }
      res.status(200).json({ message: 'Cash-in successful' });
    });
  });
};

// Process travel payment
exports.processTravel = (req, res) => {
  const { RFID, destination, fare } = req.body;
  
  // Validate input
  if (!RFID || !destination || !fare || isNaN(parseFloat(fare))) {
    return res.status(400).json({ message: 'Invalid RFID, destination, or fare' });
  }

  const parsedFare = parseFloat(fare);
  
  const query = 'UPDATE Passenger SET CurrentBalance = CurrentBalance - ? WHERE RFID = ? AND CurrentBalance >= ?';
  db.query(query, [parsedFare, RFID, parsedFare], (err, result) => {
    if (err) {
      console.error('Travel payment error:', err);
      return res.status(500).json({ message: 'Database error during payment' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Insufficient balance or invalid RFID' });
    }

    const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, Destination, Fare, RemainingBalance) VALUES (?, "Payment", ?, ?, ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
    db.query(transactionQuery, [RFID, parsedFare, destination, parsedFare, RFID], (err, result) => {
      if (err) {
        console.error('Transaction record error:', err);
        return res.status(500).json({ message: 'Failed to record transaction' });
      }
      res.status(200).json({ message: 'Travel payment processed successfully' });
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
