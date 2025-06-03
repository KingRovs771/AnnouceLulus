const path = require("path");
require('dotenv').config({
    path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`)
});

const config = {
    env : process.env.NODE_ENV,
    port : process.env.PORT || 5000,
    corsOrigin : process.env.CORS_ORIGIN || 'http://103.67.78.27',

    db :{
        host : process.env.DB_HOST ,
        user : process.env.DB_USER ,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
        connectionLimit : parseInt(process.env.DB_CONNECTION_LIMIT, 10),
    },
    logging : {
        level : process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }
}

module.exports = config;