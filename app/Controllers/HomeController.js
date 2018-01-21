"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Door_1 = require("../../core/Door");
var UserModel_1 = require("../../app/Models/UserModel");
var HomeController = /** @class */ (function () {
    function HomeController() {
        this.router = express_1.Router();
        this.routes;
    }
    // Rendre la page Welcome
    HomeController.prototype.renderWelcome = function (req, res) {
        var data = {
            pageTitle: 'welcome',
            csrfToken: req.csrfToken(),
            errors: '',
            loginErrors: '',
            req: req
        };
        res.render('home/welcome', data);
    };
    HomeController.prototype.routes = function () {
        var _this = this;
        // Page accueil
        this.router.get('/', Door_1.default.authRequired, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            pageTitle: 'home',
                            req: req,
                            csrfToken: req.csrfToken()
                        };
                        return [4 /*yield*/, UserModel_1.default.findBy('token', req.session.user)];
                    case 1:
                        data = (_a.user = _b.sent(),
                            _a);
                        res.render('home/index', data);
                        return [2 /*return*/];
                }
            });
        }); });
        this.router.post('/signup', function (req, res, next) {
            Door_1.default.register(req, res);
        });
        this.router.post('/login', function (req, res, next) {
            Door_1.default.login(req, res);
        });
        this.router.post('/validation', function (req, res, next) {
            Door_1.default.validate(req, res);
        });
        this.router.get('/logout', function (req, res, next) {
            Door_1.default.logout(req, res);
        });
        this.router.get('/welcome', Door_1.default.noAuthRequired, function (req, res, next) {
            _this.renderWelcome(req, res);
        });
        this.router.get('/signup', function (req, res, next) {
            res.redirect('welcome');
        });
        this.router.get('/login', function (req, res, next) {
            res.redirect('welcome');
        });
    };
    return HomeController;
}());
exports.HomeController = HomeController;
var HomeRoutes = new HomeController();
HomeRoutes.routes();
exports.default = HomeRoutes.router;
