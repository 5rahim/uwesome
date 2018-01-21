"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.prototype.start = function () {
        // MySQL
        process.env.DB_HOST = '127.0.0.1';
        process.env.DB_USER = 'root';
        process.env.DB_PASSWORD = '';
        process.env.DB_NAME = 'dealcity';
        // User
        process.env.DEFAULT_AVATAR = 'image_profile_picture_default.png';
        process.env.DEFAULT_PROFILE_GRADIENT = 'DEFAULT';
    };
    return Config;
}());
exports.Config = Config;
exports.default = new Config;
