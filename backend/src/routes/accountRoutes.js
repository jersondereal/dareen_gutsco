const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Get all passengers
router.get('/', accountController.getPassengers);

// Register new passenger
router.post('/', accountController.registerPassenger);

// Update passenger
router.put('/:rfid', accountController.updatePassenger);

// Delete passenger
router.delete('/:rfid', accountController.deletePassenger);

module.exports = router; 