"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.prototype.getDateTime = function () {
        var datetime = new Date().toISOString().substr(0, 19).replace('T', ' ');
        return datetime;
    };
    return Helpers;
}());
exports.Helpers = Helpers;
exports.default = new Helpers;
