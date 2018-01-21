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
var bcrypt = require("bcryptjs");
var Helpers_1 = require("./Helpers");
var UserModel_1 = require("../app/Models/UserModel");
var crypto = require('crypto');
var Door = /** @class */ (function () {
    function Door() {
        this.secret = 'uwelovesome';
    }
    Door.prototype.renderWelcome = function (req, res, registerErrors, loginErrors) {
        res.render('home/welcome', { pageTitle: 'welcome', csrfToken: req.csrfToken(), errors: registerErrors, loginErrors: loginErrors, req: req });
    };
    // Inscription
    Door.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, existUserWithEmail, existUserWithUsername, input, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Verifier les champs
                        req.checkBody('username', 'rUsernameEmpty').notEmpty();
                        req.checkBody('username', 'rUsernameAlpha').isAlphanumeric();
                        req.checkBody('email', 'rEmailEmpty').notEmpty();
                        req.checkBody('email', 'rEmail').isEmail();
                        req.checkBody('password', 'rPasswordEmpty').notEmpty();
                        req.checkBody('password', 'rPassportLength').isLength(6, 99);
                        req.assert('password', 'rPasswordEq').equals(req.body.passwordcf);
                        req.sanitize('username').trim();
                        errors = req.validationErrors();
                        if (!errors) return [3 /*break*/, 1];
                        // Retourner la page d'inscription
                        this.renderWelcome(req, res, errors, '');
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, UserModel_1.default.findBy('email', req.body.email)];
                    case 2:
                        existUserWithEmail = _a.sent();
                        if (!existUserWithEmail) return [3 /*break*/, 3];
                        // On retourne la page de bienvenue
                        this.renderWelcome(req, res, [{ msg: 'rEmailArleadyTaken' }], '');
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, UserModel_1.default.findBy('email', req.body.username)];
                    case 4:
                        existUserWithUsername = _a.sent();
                        if (!existUserWithUsername) return [3 /*break*/, 5];
                        // On retourne la page de bienvenue
                        this.renderWelcome(req, res, [{ msg: 'rUsernameArleadyTaken' }], '');
                        return [3 /*break*/, 7];
                    case 5:
                        input = {
                            username: req.body.username,
                            email: req.body.email,
                            avatar: process.env.DEFAULT_AVATAR,
                            profile_gradient: process.env.DEFAULT_PROFILE_GRADIENT,
                            //token: bcrypt.hashSync(req.body.email + Helpers.getDateTime(), bcrypt.genSaltSync(2), null),
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                            token: crypto.createHmac('sha256', this.secret)
                                .update(req.body.email + Helpers_1.default.getDateTime())
                                .digest('hex'),
                            created_at: Helpers_1.default.getDateTime(),
                            validation: 0
                        };
                        // On sauvegarde l'utilisateur
                        UserModel_1.default.save(input);
                        return [4 /*yield*/, UserModel_1.default.findBy('username', req.body.username)
                            // Sessions
                        ];
                    case 6:
                        user = _a.sent();
                        // Sessions
                        this.initSessions(req, res, user);
                        // Rediriger vers Faze en fonction de la validation
                        this.toFaze(res, user.validation);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Connexion
    Door.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req.checkBody('username', 'rUsernameEmpty').notEmpty();
                        req.checkBody('password', 'rPasswordEmpty').notEmpty();
                        errors = req.validationErrors();
                        if (!errors) return [3 /*break*/, 1];
                        // Retourner la page de connexion
                        this.renderWelcome(req, res, '', errors);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, UserModel_1.default.findBy('username', req.body.username)];
                    case 2:
                        user = _a.sent();
                        if (user) {
                            // Si les mots de passe correspondent
                            if (bcrypt.compareSync(req.body.password, user.password)) {
                                // On initialise les sessions
                                this.initSessions(req, res, user);
                                // On redirige en fonction de la validation
                                this.toFaze(res, user.validation);
                            }
                            else {
                                // Retourner la page de connexion
                                this.renderWelcome(req, res, '', [{ msg: 'rIncorrectPassword' }]);
                            }
                        }
                        else {
                            // Retourner la page de connexion
                            this.renderWelcome(req, res, '', [{ msg: 'unknowUser' }]);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Initialiser les sessions et cookies
    Door.prototype.initSessions = function (req, res, user) {
        req.session.user = user.token;
        req.session.validation = user.validation;
        res.cookie('user_stoken', user.token, { maxAge: 2628000000, httpOnly: true });
    };
    // On récupère les informations de l'utilisateur actuel
    Door.prototype.getUser = function (req) {
        // Si l'utilisateur est connecté
        if (this.isAuth) {
            return new Promise(function (resolve, reject) {
                var user = UserModel_1.default.findBy('token', req.session.user);
                resolve(user);
            });
        }
    };
    // Recupérer le token
    Door.prototype.getToken = function (req) {
        if (this.isAuth)
            return req.session.user;
        else
            return '';
    };
    // Si l'utilisateur est connecté ou pas
    Door.prototype.isAuth = function (req) {
        return (req.session.user && req.cookies.user_stoken);
    };
    // Rediriger vers Faze en fonction de la validation
    Door.prototype.toFaze = function (res, validation) {
        if (validation == 0) {
            return res.redirect('/faze');
        }
        else {
            return res.redirect('/');
        }
    };
    // Middleware de verification des sessions et des cookies
    Door.prototype.checkSessionAndCookie = function (req, res, next) {
        // Si il y a un cookie du token mais pas de session
        if (req.cookies.user_stoken && !req.session.user) {
            res.clearCookie('user_stoken');
            // Si le cookie du token est différent de la session
            // Pour prevenir une tentative de modification du token via le navigateur
        }
        else if (req.cookies.user_stoken !== req.session.user) {
            res.clearCookie('user_stoken');
            req.session.destroy(function (err) { });
        }
        next();
    };
    Door.prototype.noAuthRequired = function (req, res, next) {
        if (req.session.user && req.cookies.user_stoken) {
            return res.redirect('/');
        }
        else {
            next();
        }
    };
    // Besoin que la session utilisateur existe
    Door.prototype.authRequired = function (req, res, next) {
        // Si l'utilisateur n'est pas connecté
        if (!req.session.user) {
            // On le redirige vers la page de bienvenue
            return res.redirect('/welcome');
        }
        else {
            // Si l'utilisateur n'est validé
            if (req.session.validation == 0) {
                // On le redirige vers Faze
                return res.redirect('/faze');
            }
            else {
                next();
            }
        }
    };
    // Besoin qu'une session existe pour Faze
    Door.prototype.authRequiredForFaze = function (req, res, next) {
        // Si l'utilisateur n'est pas connecté
        if (!req.session.user) {
            return res.redirect('/welcome');
        }
        else {
            // Si l'utilisateur est validé on le redirige vers l'accueil
            if (req.session.validation == 1) {
                return res.redirect('/');
            }
            else {
                next();
            }
        }
    };
    // Valider un utilisateur
    Door.prototype.validate = function (req, res) {
        if (req.cookies.user_stoken && req.session.user) {
            UserModel_1.default.update('validation', 1, req.session.user);
            req.session.validation = 1;
            return res.redirect('/');
        }
        else {
            return res.redirect('/welcome');
        }
    };
    // Déconnexion
    Door.prototype.logout = function (req, res) {
        // On verifie si les sessions et cookies existe
        if (this.isAuth(req)) {
            // On supprime le cookie
            res.clearCookie('user_stoken');
            // On supprime les sessions
            req.session.destroy(function (err) { });
            // On redirige vers la page de bienvenue
            return res.redirect('/welcome');
        }
        else {
            // On redirige vers la page de bienvenue
            return res.redirect('/welcome');
        }
    };
    return Door;
}());
exports.Door = Door;
exports.default = new Door;
