const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Import database connection
const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../')));

// Make db available to routes
app.locals.db = db;

// Routes
app.use('/api', authRoutes);
app.use('/api', recordRoutes);

// API Routes
// Get all passengers
app.get('/api/passengers', (req, res) => {
  const query = 'SELECT * FROM Passenger';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching passengers:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Register new passenger
app.post('/api/register', (req, res) => {
  const { RFID, firstName, lastName, phoneNumber, currentBalance } = req.body;
  const query = 'INSERT INTO Passenger (RFID, FirstName, LastName, PhoneNumber, CurrentBalance) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [RFID, firstName, lastName, phoneNumber, currentBalance], (err, result) => {
    if (err) {
      console.error('Error registering passenger:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Passenger registered successfully' });
  });
});

// Process travel payment
app.post('/api/travel', (req, res) => {
  const { RFID, destination, fare } = req.body;
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // First check and update passenger balance
    const updateQuery = 'UPDATE Passenger SET CurrentBalance = CurrentBalance - ? WHERE RFID = ? AND CurrentBalance >= ?';
    db.query(updateQuery, [fare, RFID, fare], (err, result) => {
      if (err || result.affectedRows === 0) {
        db.rollback();
        return res.status(400).json({ error: 'Insufficient balance or invalid RFID' });
      }

      // Then record the transaction
      const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, Destination, Fare, RemainingBalance) VALUES (?, "Payment", ?, ?, ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
      db.query(transactionQuery, [RFID, fare, destination, fare, RFID], (err, result) => {
        if (err) {
          db.rollback();
          return res.status(500).json({ error: 'Database error' });
        }

        db.commit(err => {
          if (err) {
            db.rollback();
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Travel payment processed successfully' });
        });
      });
    });
  });
});

// Process cash in
app.post('/api/cashin', (req, res) => {
  const { RFID, amount } = req.body;
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Update passenger balance
    const updateQuery = 'UPDATE Passenger SET CurrentBalance = CurrentBalance + ? WHERE RFID = ?';
    db.query(updateQuery, [amount, RFID], (err, result) => {
      if (err || result.affectedRows === 0) {
        db.rollback();
        return res.status(400).json({ error: 'Invalid RFID' });
      }

      // Record the transaction
      const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, RemainingBalance) VALUES (?, "Cash-in", ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
      db.query(transactionQuery, [RFID, amount, RFID], (err, result) => {
        if (err) {
          db.rollback();
          return res.status(500).json({ error: 'Database error' });
        }

        db.commit(err => {
          if (err) {
            db.rollback();
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Cash-in processed successfully' });
        });
      });
    });
  });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
  const query = 'SELECT * FROM Transactions ORDER BY Timestamp DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Delete passenger
app.delete('/api/passenger/:rfid', (req, res) => {
  const { rfid } = req.params;
  const query = 'DELETE FROM Passenger WHERE RFID = ?';
  db.query(query, [rfid], (err, result) => {
    if (err) {
      console.error('Error deleting passenger:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Passenger deleted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
