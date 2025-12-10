
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

//                VALIDATION SECTION      ----        VALIDATION SECTION

function validateRecord(record) {
    const cleanRecord = {};

    // VALIDATION: first_name
    const firstName = record.first_name ? record.first_name.trim() : ''; // trim to ensure no spaces
    if (!firstName) {
        return { 
            isValid: false, 
            error: "The 'first_name' cannot be empty.", 
            cleanRecord: null 
        };
    }
    
    cleanRecord.first_name = firstName; 

    //VALIDATION: last_name , basically the same as the above
    const lastName = record.last_name ? record.last_name.trim() : '';
    if (!lastName) {
        return { 
            isValid: false, 
            error: "The 'last_name' cannot be empty.", 
            cleanRecord: null 
        };
    }
    cleanRecord.last_name = lastName;

    // VALIDATION: email
    const email = record.email ? record.email.trim() : '';
    // Basic regular expression to check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!email || !emailRegex.test(email)) {
        return { 
            isValid: false, 
            error: "The 'email' is not a valid format.", 
            cleanRecord: null 
        };
    }
    cleanRecord.email = email;

    //VALIDATION: age
    const age = parseInt(record.age, 10);
    // Checks if it is a valid number AND if it is greater than or equal to 1
    if (isNaN(age) || age < 1) { 
        return { 
            isValid: false, 
            error: "The 'age' must be a positive number.", 
            cleanRecord: null 
        };
    }
    cleanRecord.age = age;

    // If all validations pass, return success
    return { 
        isValid: true, 
        error: null, 
        cleanRecord 
    };
}

// end of the function validateRecord 
//                  --      --      --      --

// MAIN PROCESSING AND DB INSERTION FUNCTION

async function processCsvAndInsert() {
    let connection;
    const validRecords = [];
    let currentRow = 1; // not counting the first line
    let totalInvalid = 0;

    console.log(` Processing file: ${csvName}`);

    // Reading and Validating the CSV file
    try {
        // Wrap the stream reading in a Promise to use async/await
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvName)
                .pipe(csv())
                .on('data', (data) => {
                    // The .on('data') event fires for each record after the header
                    currentRow++; 

                    const validationResult = validateRecord(data);
                    
                    if (validationResult.isValid) {
                        validRecords.push(validationResult.cleanRecord);
                    } else {
                        totalInvalid++;
                        // SHOW ERROR MESSAGE WITH THE ROW NUMBER
                        console.error(`ERROR on Line ${currentRow}: ${validationResult.error}. Invalid Record:`, data);
                    }
                })
                .on('end', () => {
                    console.log(`CSV reading complete.`);
                    console.log(`Total Records read (excluding header): ${currentRow - 1}`);
                    console.log(`Total Valid Records found: ${validRecords.length}`);
                    console.log(`Total Invalid Records found: ${totalInvalid}`);
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

    } catch (error) {
        console.error(`Error reading CSV file. Check the path or format: ${error.message}`);
        return;
    }

    // If no valid records, stop here
    if (validRecords.length === 0) {
        console.log("No valid records to insert into the database. Process end.");
        return;
    }

    // --- Part 2: Database Insertion ---
    console.log(` Attempting to connect to the Database and insert ${validRecords.length} records`);

    try {
        // Establish the connection
        connection = await mysql.createConnection(dbConfig);
        console.log(" Database connection established successfully!");

        // Prepare the SQL INSERT statement
        const columns = Object.keys(validRecords[0]).join(', '); // Ex: 'first_name, last_name, email, age'
        
        // SQL for Batch Insert (highly efficient)
        // Note: The mysql2 library handles turning the array of arrays (values) into a multi-row INSERT statement
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES ?`;

        // Map valid records to an array of value arrays: [[v1, v2, v3], [v4, v5, v6], ...]
        const values = validRecords.map(record => Object.values(record));

        // Execute the SQL statement for all records at once.
        const [result] = await connection.query(sql, [values]);

        console.log(` SUCCESS! ${result.affectedRows} valid records were inserted into the table ${tableName}.`);
        
    } catch (error) {
        console.error("DATABASE ERROR during insertion. Check table structure and credentials:", error.message);
        
    } 
    }


processCsvAndInsert();


