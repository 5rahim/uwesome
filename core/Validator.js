"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = /** @class */ (function () {
    function Validator() {
    }
    Validator.prototype.validate = function (data, rules) {
        console.log(data);
    };
    return Validator;
}());
exports.Validator = Validator;
exports.default = new Validator;
