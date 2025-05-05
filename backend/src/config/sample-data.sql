INSERT INTO Passenger (RFID, FirstName, LastName, PhoneNumber, CurrentBalance)
VALUES 
    ('10000001', 'John',      'Doe',      '09123456789', 500.00),
    ('10000002', 'Jane',      'Smith',    '09234567890', 1000.00),
    ('10000003', 'Mary',      'Johnson',  '09345678901', 1500.00),
    ('10000004', 'James',     'Brown',    '09456789012', 200.00),
    ('10000005', 'Patricia',  'Davis',    '09567890123', 800.00),
    ('10000006', 'Michael',   'Miller',   '09678901234', 300.00),
    ('10000007', 'Linda',     'Wilson',   '09789012345', 250.00),
    ('10000008', 'Robert',    'Moore',    '09890123456', 100.00),
    ('10000009', 'Barbara',   'Taylor',   '09123456780', 1200.00),
    ('10000010', 'William',   'Anderson', '09234567881', 700.00),
    ('10000011', 'Elizabeth', 'Thomas',   '09345678902', 950.00),
    ('10000012', 'David',     'Jackson',  '09456789013', 0.00),
    ('10000013', 'Jennifer',  'White',    '09567890124', 450.00),
    ('10000014', 'Richard',   'Harris',   '09678901235', 600.00),
    ('10000015', 'Susan',     'Martin',   '09789012346', 120.00),
    ('10000016', 'Joseph',    'Thompson', '09890123457', 2000.00),
    ('10000017', 'Sarah',     'Garcia',   '09123456782', 3000.00),
    ('10000018', 'Charles',   'Martinez', '09234567883', 50.00),
    ('10000019', 'Karen',     'Robinson', '09345678903', 75.00),
    ('10000020', 'Thomas',    'Clark',    '09456789014', 500.00);

INSERT INTO Transactions (TransactionID, RFID, TransactionType, Amount, Destination, Fare, RemainingBalance, Timestamp)
VALUES 
    (1,  '10000001', 'Cash-in',  100.00, NULL,          NULL,  600.00,  '2024-03-01 08:00:00'),
    (2,  '10000001', 'Payment',   50.00, 'Mercedes',     50.00, 550.00,  '2024-03-01 09:15:00'),
    (3,  '10000002', 'Cash-in',  200.00, NULL,          NULL,  1200.00, '2024-03-01 10:30:00'),
    (4,  '10000002', 'Payment',  150.00, 'Lawaan',      150.00, 1050.00, '2024-03-01 11:45:00'),
    (5,  '10000003', 'Payment',  250.00, 'Tacloban',    250.00, 1000.00, '2024-03-01 13:00:00'),
    (6,  '10000003', 'Cash-in',  300.00, NULL,          NULL,  1300.00, '2024-03-01 14:15:00'),
    (7,  '10000004', 'Payment',   50.00, 'Mercedes',     50.00, 150.00,  '2024-03-01 15:30:00'),
    (8,  '10000005', 'Cash-in',  200.00, NULL,          NULL,  1000.00, '2024-03-01 16:45:00'),
    (9,  '10000005', 'Payment',  200.00, 'Basey',       200.00, 750.00,  '2024-03-02 08:00:00'),
    (10, '10000006', 'Cash-in',  100.00, NULL,          NULL,  400.00,  '2024-03-02 09:15:00'),
    (11, '10000006', 'Payment',  100.00, 'Quinapondan', 100.00, 250.00,  '2024-03-02 10:30:00'),
    (12, '10000007', 'Payment',   50.00, 'Mercedes',     50.00, 200.00,  '2024-03-02 11:45:00'),
    (13, '10000007', 'Cash-in',   50.00, NULL,          NULL,  250.00,  '2024-03-02 13:00:00'),
    (14, '10000008', 'Payment',  100.00, 'Giporlos',    100.00, 0.00,   '2024-03-02 14:15:00'),
    (15, '10000009', 'Cash-in',  500.00, NULL,          NULL,  1700.00, '2024-03-02 15:30:00'),
    (16, '10000009', 'Payment',  120.00, 'Balangiga',   120.00, 1400.00, '2024-03-02 16:45:00'),
    (17, '10000010', 'Cash-in',  100.00, NULL,          NULL,  800.00,  '2024-03-03 08:00:00'),
    (18, '10000010', 'Payment',   50.00, 'Mercedes',     50.00, 750.00,  '2024-03-03 09:15:00'),
    (19, '10000011', 'Payment',  250.00, 'Tacloban',    250.00, 450.00,  '2024-03-03 10:30:00'),
    (20, '10000012', 'Cash-in', 1000.00, NULL,          NULL,  1000.00, '2024-03-03 11:45:00');

INSERT INTO Users (UserID, Username, Email, Password, Role, RFID, CreatedAt)
VALUES 
    (1,  'johndoe',      'johndoe@example.com',      '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000001', '2024-03-01 00:00:00'),
    (2,  'janesmith',    'janesmith@example.com',    '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000002', '2024-03-01 00:00:00'),
    (3,  'maryjohnson',  'maryjohnson@example.com',  '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000003', '2024-03-01 00:00:00'),
    (4,  'admin',        'admin@example.com',        '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Admin',     NULL,        '2024-03-01 00:00:00'),
    (5,  'operator1',    'operator1@example.com',    '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Operator',  NULL,        '2024-03-01 00:00:00'),
    (6,  'operator2',    'operator2@example.com',    '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Operator',  NULL,        '2024-03-01 00:00:00'),
    (7,  'jamesbrown',   'jamesbrown@example.com',   '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000004', '2024-03-01 00:00:00'),
    (8,  'patriciadavis','patriciadavis@example.com','$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000005', '2024-03-01 00:00:00'),
    (9,  'michaelmiller','michaelmiller@example.com','$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000006', '2024-03-01 00:00:00'),
    (10, 'lindawilson',  'lindawilson@example.com',  '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000007', '2024-03-01 00:00:00');