const db = require('../config/database');

// Register a new passenger
exports.registerPassenger = (req, res) => {
  const { RFID, firstName, lastName, phoneNumber, currentBalance } = req.body;
  const query = 'INSERT INTO Passenger (RFID, FirstName, LastName, PhoneNumber, CurrentBalance) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [RFID, firstName, lastName, phoneNumber, currentBalance], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('Passenger registered successfully');
  });
};

// Get all passengers
exports.getPassengers = (req, res) => {
  const query = 'SELECT * FROM Passenger';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Update a passenger
exports.updatePassenger = (req, res) => {
  const { rfid } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;
  const query = 'UPDATE Passenger SET FirstName = ?, LastName = ?, PhoneNumber = ? WHERE RFID = ?';
  db.query(query, [firstName, lastName, phoneNumber, rfid], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Passenger updated successfully');
  });
};

// Delete a passenger
exports.deletePassenger = (req, res) => {
  const { rfid } = req.params;
  const query = 'DELETE FROM Passenger WHERE RFID = ?';
  db.query(query, [rfid], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Passenger deleted successfully');
  });
};
