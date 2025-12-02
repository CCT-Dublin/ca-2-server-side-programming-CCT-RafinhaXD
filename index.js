
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




