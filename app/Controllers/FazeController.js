"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Door_1 = require("../../core/Door");
var FazeController = /** @class */ (function () {
    function FazeController() {
        this.router = express_1.Router();
        this.routes;
    }
    FazeController.prototype.renderFaze = function (req, res) {
        res.render('home/faze', { pageTitle: 'Faze', errors: '', csrfToken: req.csrfToken(), req: req });
    };
    FazeController.prototype.routes = function () {
        var _this = this;
        this.router.get('/', Door_1.default.authRequiredForFaze, function (req, res, next) {
            _this.renderFaze(req, res);
        });
    };
    return FazeController;
}());
exports.FazeController = FazeController;
var FazeRoutes = new FazeController();
FazeRoutes.routes();
exports.default = FazeRoutes.router;
