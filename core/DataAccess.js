"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var DataAccess = /** @class */ (function () {
    function DataAccess() {
        this.initialize();
        this.connection;
    }
    DataAccess.prototype.initialize = function () {
        // Debuter la connexion à mysql
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        // Logger
        this.connection.connect(function (err) {
            if (!err) {
                console.log("Database is connected");
            }
            else {
                console.log("Error connecting database");
            }
        });
    };
    return DataAccess;
}());
exports.DataAccess = DataAccess;
exports.default = new DataAccess;
