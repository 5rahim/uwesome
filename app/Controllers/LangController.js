"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var LangController = /** @class */ (function () {
    function LangController() {
        this.router = express_1.Router();
        this.routes;
        this.maxAge = 9999999999999999;
    }
    LangController.prototype.routes = function () {
        var _this = this;
        this.router.get('/en', function (req, res, next) {
            res.cookie('ilang', 'en', { maxAge: _this.maxAge, httpOnly: true });
            res.redirect('/');
        });
        this.router.get('/fr', function (req, res, next) {
            res.cookie('ilang', 'fr', { maxAge: _this.maxAge, httpOnly: true });
            res.redirect('/');
        });
    };
    return LangController;
}());
exports.LangController = LangController;
var LangRoutes = new LangController();
LangRoutes.routes();
exports.default = LangRoutes.router;
