const mysql = require('mysql');
const dbconfig = require('../config/dbconfig');


const connection = mysql.createConnection(dbconfig);

connection.connect((err) => {
    if(err) throw err;
    console.log("Database connected...");
})

module.exports = connection;