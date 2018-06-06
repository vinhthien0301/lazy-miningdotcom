var mysql = require('mysql');

var config = require('../config.json');

var pool = mysql.createPool({
    host: config.database_host,
    port: config.database_port,
    user: config.database_username,
    password: config.database_password,
    database: config.database_name,
    connectionLimit: 10,
    supportBigNumbers: true
});

