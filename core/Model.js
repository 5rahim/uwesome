"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataAccess_1 = require("./DataAccess");
var Model = /** @class */ (function () {
    function Model(table) {
        this.table = table;
    }
    Model.prototype.getTable = function () {
        return this.table;
    };
    Model.prototype.findBy = function (key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            DataAccess_1.default.connection.query('SELECT * FROM ' + _this.table + ' WHERE ' + key + ' = ? LIMIT 1', [value], function (err, rows) {
                if (err)
                    reject(err);
                if (rows)
                    resolve(rows[0]);
                else
                    resolve(null);
            });
        });
    };
    Model.prototype.find = function (query, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT * FROM ' + _this.table + ' ' + query;
            DataAccess_1.default.connection.query(sql, value, function (err, rows) {
                if (err)
                    reject(err);
                if (rows)
                    resolve(rows[0]);
            });
        });
    };
    Model.prototype.get = function (column, key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            DataAccess_1.default.connection.query('SELECT ' + column + ' FROM ' + _this.table + ' WHERE ' + key + ' = ? LIMIT 1', [value], function (err, rows) {
                if (err)
                    reject(err);
                resolve(rows[0]);
            });
        });
    };
    Model.prototype.save = function (input) {
        DataAccess_1.default.connection.query('INSERT INTO ' + this.table + ' SET ?', [input], function (err, rows) {
            if (err)
                console.log(err);
        });
    };
    Model.prototype.update = function (key, value, token) {
        DataAccess_1.default.connection.query('UPDATE ' + this.table + ' SET ' + key + ' = ? WHERE token = ?', [value, token], function (err, rows) {
            if (err)
                console.log(err);
        });
    };
    Model.prototype.exist = function (key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            DataAccess_1.default.connection.query('SELECT * FROM ' + _this.table + ' WHERE ' + key + ' = ? LIMIT 1', [value], function (err, rows) {
                if (err)
                    reject(err);
                if (rows[0])
                    resolve(true);
                else
                    resolve(false);
            });
        });
    };
    return Model;
}());
exports.Model = Model;
