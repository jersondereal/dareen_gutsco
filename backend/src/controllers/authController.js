const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    console.log('Login attempt:', { username });

    if (!username || !password) {
        console.log('Missing credentials:', { username: !!username, password: !!password });
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Login database error:', {
                error: err,
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState,
                sqlMessage: err.sqlMessage
            });
            return res.status(500).json({ 
                message: 'Internal server error',
                error: err.message 
            });
        }

        console.log('Database results:', { 
            userFound: results.length > 0,
            username: username
        });

        if (results.length === 0) {
            console.log("No user found with username:", username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const token = jwt.sign(
            { userId: user.UserID, role: user.Role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            role: user.Role,
            userId: user.UserID,
            rfid: user.RFID
        });
    });
};

// Register new user
exports.signup = async (req, res) => {
    const { username, email, password, role, rfid } = req.body;

    // Check if username exists
    const checkUsername = 'SELECT * FROM Users WHERE Username = ?';
    db.query(checkUsername, [username], async (err, results) => {
        if (err) {
            console.error('Signup error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Check if email exists
        const checkEmail = 'SELECT * FROM Users WHERE Email = ?';
        db.query(checkEmail, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            // If RFID provided, check if it exists
            if (rfid) {
                const checkRFID = 'SELECT * FROM Users WHERE RFID = ?';
                db.query(checkRFID, [rfid], async (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (results.length > 0) {
                        return res.status(409).json({ message: 'RFID already registered' });
                    }

                    createUser();
                });
            } else {
                createUser();
            }
        });
    });

    function createUser() {
        const query = 'INSERT INTO Users (Username, Email, Password, Role, RFID) VALUES (?, ?, ?, ?, ?)';
        
        db.query(query, [username, email, password, role, rfid || null], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).json({ message: 'Failed to create user' });
            }
            
            res.status(201).json({ message: 'User created successfully' });
        });
    }
}; 