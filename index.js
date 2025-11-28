
//Import Modules
const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

//Database Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '0987', 
    database: 'ca2_server_side'
};

// CSV File and Table Names
const csvName = 'person_info.csv';
const tableName = 'mysql_table';

// Variable to store all records  from the CSV
const records = [];




