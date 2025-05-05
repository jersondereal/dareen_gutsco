const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const recordController = require('../controllers/recordController');

// Passenger account routes
router.post('/register', accountController.registerPassenger);
router.get('/passengers', accountController.getPassengers);
router.put('/passenger/:rfid', accountController.updatePassenger);
router.delete('/passenger/:rfid', accountController.deletePassenger);

// Transaction routes
router.post('/cashin', recordController.cashIn);
router.post('/travel', recordController.processTravel);
router.get('/transactions', recordController.getTransactions);
router.delete('/transaction/:id', recordController.deleteTransaction);

module.exports = router;
