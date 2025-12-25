const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// --- Middleware: Request Logging ---
// This middleware logs the HTTP method and URL of each incoming request.
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Database Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0987',
    database: 'CA2T2'
}).promise();

// --- Database Schema Verification ---
// This asynchronous function ensures that the 'users' table exists in the database.
// If the table does not exist, it creates it with the specified schema.
// This is part of a "Defense in Depth" strategy to ensure database readiness.
async function verifyDatabaseSchema() {
    const schemaSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(10) NOT NULL,
            eircode VARCHAR(8) NOT NULL,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await db.query(schemaSQL);
        console.log('Database schema verified successfully.');
    } catch (error) {
        console.error('Error verifying database schema:', error);
        process.exit(1); // Exit if schema verification fails
    }
}

// --- Routes ---

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { first_name, last_name, email, phone, eircode } = req.body;

    if (!first_name || !last_name || !email || !phone || !eircode) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO users (first_name, last_name, email, phone, eircode) VALUES (?, ?, ?, ?, ?)';
    
    try {
        await db.query(sql, [first_name, last_name, email, phone, eircode.toUpperCase()]);
        res.status(200).send('<h1>Success</h1><p>Your data has been saved.</p><a href="/">Go Back</a>');
    } catch (error) {
        console.error('Database insertion error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).send('<h1>Error</h1><p>This email address is already registered.</p><a href="/">Go Back</a>');
        } else {
            res.status(500).send('<h1>Error</h1><p>An error occurred while saving your data.</p><a href="/">Go Back</a>');
        }
    }
});

// --- Start Server ---
// The `startServer` function is responsible for:
// 1. Verifying the database schema before the server starts.
// 2. Starting the Express server and listening on the specified port.
// 3. Implementing robust error handling for port conflicts (e.g., EADDRINUSE).
async function startServer() {
    await verifyDatabaseSchema();
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Error: Port ${port} is already in use.`);
        } else {
            console.error(`An error occurred: ${err.message}`);
        }
        process.exit(1); // Exit process if port is in use or other server errors occur
    });
}

startServer();
