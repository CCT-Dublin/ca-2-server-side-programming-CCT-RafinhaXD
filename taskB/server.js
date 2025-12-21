const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'taskB' directory
app.use(express.static(path.join(__dirname)));

//  Database Connection 

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0987', 
    database: 'CA2T2'
}).promise();

// Routes 

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { first_name, last_name, email, phone, eircode } = req.body;

    // Basic server-side validation to ensure no fields are empty
    if (!first_name || !last_name || !email || !phone || !eircode) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO users (first_name, last_name, email, phone, eircode) VALUES (?, ?, ?, ?, ?)';
    
    try {
        await db.query(sql, [first_name, last_name, email, phone, eircode.toUpperCase()]);
        res.status(200).send('<h1>Success</h1><p>Your data has been saved.</p><a href="/">Go Back</a>');
    } catch (error) {
        console.error('Database insertion error:', error);
        // More user-friendly error handling
        if (error.code === 'ER_DUP_ENTRY') {
             res.status(409).send('<h1>Error</h1><p>This email address is already registered.</p><a href="/">Go Back</a>');
        } else {
             res.status(500).send('<h1>Error</h1><p>An error occurred while saving your data.</p><a href="/">Go Back</a>');
        }
    }
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});