"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View = /** @class */ (function () {
    function View() {
    }
    View.prototype.initialize = function (app, path) {
        // Paramétrage du moteur de rendu
        app.set('views', path.join(process.env.BASE, 'views'));
        app.set('view engine', 'ejs');
    };
    return View;
}());
exports.View = View;
exports.default = new View;
