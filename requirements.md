# Requirements Document for RFID-Based Web Application

## Purpose
The purpose of this RFID-based web application is to streamline passenger account management and transactions for GUTSCO (Guiuan Tours Corporation). Passengers can register accounts and use RFID cards as digital wallets to make travel payments efficiently and securely. This system eliminates the need for physical cash, ensuring a seamless and accountable travel experience.

## Features
### Passenger Account Management
- Passengers can register accounts, which will be stored in the database.
- Account fields include:
  - RFID (unique identifier for passengers)
  - First Name
  - Last Name
  - Phone Number
  - Current Balance
- Passengers can cash in funds to their accounts for travel payments.

### Travel and Payment System
- Passengers can use their account balance to pay for GUTSCO services.
- RFID cards act as digital wallets for cash-in and payment operations.

### Homepage and User Interface
- A user-friendly homepage that includes tools for managing passengers and transactions:
  - **Passenger Records Table:** Displays passenger details.
  - **Register Button:** Opens a form for registering new passengers.
  - **Travel Button:** Opens a form to process travel payments with fields for:
    - RFID
    - Destination
    - Fare
    - Remaining Balance
  - **Cash In Button:** Opens a form to add funds to passenger accounts with fields for:
    - RFID
    - Amount

### Login Page
- A login page for role-based access:
  - **Lower-Role Admins:**
    - Can manage passenger accounts.
    - Can view transaction history.
    - Can perform cash-in and travel operations.
  - **Higher-Up Admins:**
    - Have all permissions of lower-role admins.
    - Can edit or delete transactions in the Transactions Table.

### CRUD Operations
- **Passenger Table:** Full Create, Read, Update, and Delete (CRUD) functionality available for all authorized users.
- **Transactions Table:**
  - Authorized higher-ups can perform Edit or Delete operations.
  - All users can view transaction history.

## Database Design
### Tables
1. **Passenger Table:**
   - Fields:
     - RFID (Primary Key, unique)
     - First Name
     - Last Name
     - Phone Number
     - Current Balance

2. **Transactions Table:**
   - Fields:
     - RFID (Foreign Key linking to Passenger Table)
     - Transaction Type (e.g., Cash-in or Payment)
     - Amount
     - Destination
     - Fare
     - Remaining Balance
     - Timestamp

## User Roles & Permissions
- **Lower-Role Admins:**
  - Can perform CRUD operations on the Passenger Table.
  - Can view transactions.
  - Can manage passenger accounts and perform cash-in/travel operations.
- **Higher-Up Admins:**
  - Can perform Edit and Delete operations on the Transactions Table.
  - Have access to all features and data.
- **General Users:**
  - Limited to viewing data and using the cash-in or travel features.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** ExpressJS
- **Database:** MariaDB
- **Design reference:** Similar to ShadCDN's New York style

## Implementation Notes
- The application ensures passengers can manage accounts without physical cash.
- All transactions are recorded for transparency and accountability.
- Strict role-based access control ensures data integrity and prevents unauthorized edits.
