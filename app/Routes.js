"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var HomeController_1 = require("./Controllers/HomeController");
var LangController_1 = require("./Controllers/LangController");
var FazeController_1 = require("./Controllers/FazeController");
var ProfileController_1 = require("./Controllers/ProfileController");
var Locals_1 = require("../Locals");
var Routes = /** @class */ (function () {
    function Routes() {
    }
    Routes.prototype.initialize = function (app) {
        var router;
        router = express_1.Router();
        // Locals
        Locals_1.default.init(app);
        // Routes
        app.use('/', HomeController_1.default);
        app.use('/faze', FazeController_1.default);
        app.use('/lang', LangController_1.default);
        app.use('/', ProfileController_1.default);
    };
    return Routes;
}());
exports.Routes = Routes;
exports.default = new Routes;
