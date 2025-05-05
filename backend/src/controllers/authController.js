const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM Users WHERE Username = ?';
    db.query(query, [username], async (err, results) => {

        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log("no results")
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.Password);

        console.log(password, user.Password)
        
        if (!validPassword) {
            console.log("invalid password")
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user.UserID, role: user.Role },
            process.env.JWT_SECRET,
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

                    await createUser();
                });
            } else {
                await createUser();
            }
        });
    });

    async function createUser() {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = 'INSERT INTO Users (Username, Email, Password, Role, RFID) VALUES (?, ?, ?, ?, ?)';
            
            db.query(query, [username, email, hashedPassword, role, rfid || null], (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ message: 'Failed to create user' });
                }
                
                res.status(201).json({ message: 'User created successfully' });
            });
        } catch (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}; 