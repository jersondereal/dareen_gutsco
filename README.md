# GUTSCO RFID-Based Payment System

A modern web-based payment system for managing passenger transactions using RFID technology.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Guide](#user-guide)
- [System Roles](#system-roles)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Features

- RFID-based passenger registration and management
- Secure payment processing for travel fares
- Cash-in functionality for passenger balances
- Role-based access control (Admin, Operator, Passenger)
- Transaction history and tracking
- Real-time balance updates
- Responsive modern UI design

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Web browser (Chrome, Firefox, or Edge recommended)

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd gutsco-system
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_PORT=3307
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=dareen_gutsco
     JWT_SECRET=your_secret_key
     ```

## Database Setup

1. Create a new MySQL database:

```sql
CREATE DATABASE dareen_gutsco;
```

2. Import the schema:

```bash
mysql -u your_user -p dareen_gutsco < backend/src/config/schema.sql
```

3. (Optional) Import sample data:

```bash
mysql -u your_user -p dareen_gutsco < backend/src/config/sample-data.sql
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Access the application:
   - Open `http://localhost:3000` in your web browser
   - Default admin credentials:
     - Username: admin
     - Password: admin123

## User Guide

### For Passengers

1. **Registration**:

   - Sign up with your details and RFID number
   - Your initial balance will be set to 0

2. **Cash In**:

   - Visit any operator to add money to your account
   - Minimum cash-in amount: ₱1.00

3. **Travel**:
   - Present your RFID card when traveling
   - Ensure sufficient balance for your destination
   - Check your transaction history anytime

### For Operators

1. **Passenger Management**:

   - Register new passengers
   - Edit passenger information
   - View passenger balances

2. **Transaction Processing**:
   - Process travel payments
   - Handle cash-in requests
   - View transaction history

### For Admins

1. **Full System Access**:
   - All operator capabilities
   - Delete transactions
   - Manage user accounts
   - System monitoring

## System Roles

1. **Passenger**

   - View personal information
   - View transaction history
   - Check current balance

2. **Operator**

   - Register new passengers
   - Process transactions
   - View all passenger records
   - Edit passenger information

3. **Admin**
   - All operator capabilities
   - Delete transactions
   - Full system management

## API Documentation

### Authentication Endpoints

- POST `/api/login` - User login
- POST `/api/signup` - User registration

### Passenger Endpoints

- GET `/api/passengers` - Get all passengers
- POST `/api/register` - Register new passenger
- PUT `/api/passenger/:rfid` - Update passenger
- DELETE `/api/passenger/:rfid` - Delete passenger

### Transaction Endpoints

- GET `/api/transactions` - Get all transactions
- POST `/api/travel` - Process travel payment
- POST `/api/cashin` - Process cash-in
- DELETE `/api/transaction/:id` - Delete transaction

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check if MySQL is running
   - Verify database credentials in .env
   - Ensure correct port configuration

2. **Login Issues**

   - Clear browser cache
   - Check username/password
   - Verify user role permissions

3. **Transaction Errors**
   - Confirm sufficient balance
   - Check RFID validity
   - Verify network connection
