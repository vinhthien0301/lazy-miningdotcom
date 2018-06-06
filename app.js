var express = require('express'), stylus = require('stylus')
    , nib = require('nib');

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var express_logger = require('morgan');
var bodyParser = require('body-parser');
var i18n = require('i18n');


var config = require('./config.json');



var db = require('./databases/database');
var app = express();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
i18n.configure({
    locales: ['vi'],
    directory: __dirname + '/locales'
});
// View engine setup
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '/dist/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist')));
var options = {
    host: config.database_host,
    port: config.database_port,
    user: config.database_username,
    password: config.database_password,
    database: config.database_name,
    checkExpirationInterval: 10000, // 10 seconds
    expiration: 300000, // 5 minutes
    schema: {
        tableName: 'trWebSessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);
// app.use(session({
//     secret: "eTd=fQ!&#g9@9G56XJa4P+rKd%!33b5h+DNA&!M_",
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: true
// }));

// Enable All CORS Requests
app.use(cors());
app.use(stylus.middleware(
    {
        src: __dirname + '/dist'
        , compile: compile
    }
));

app.use(express_logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(i18n.init);

// Make miner data accessible to the router
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    next();
});
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes/index'));


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
// Development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;


var moment = require('moment');
require("moment-duration-format");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ip = require('ip');
var db = require('./databases/database');


// --------------- BOOT ---------------



var log4js = require('log4js');
var logger = log4js.getLogger();
logger.setLevel(config.log_level ? config.log_level : 'INFO');

logger.warn('App: booting');
// --------------- /BOOT ---------------


http.listen(config.listen_port, function () {

    logger.info('App: listening on ' + ip.address() + ':' + config.listen_port);
});
