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
var FriendshipRequestsModel_1 = require("../app/Models/FriendshipRequestsModel");
var FriendshipModel_1 = require("../app/Models/FriendshipModel");
var Helpers_1 = require("./Helpers");
var UserModel_1 = require("../app/Models/UserModel");
var DataAccess_1 = require("./DataAccess");
var User_1 = require("./User");
var crypto = require('crypto');
var Friendship = /** @class */ (function () {
    function Friendship() {
        this.friendshipRequestsTable = "friendship_requests";
        this.friendshipTable = "friendship";
    }
    Friendship.prototype.initialize = function (io) {
        var _this = this;
        io.sockets.on('connection', function (socket) {
            // Friend Requests
            socket.on('friend-request', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var getFriendRequest, input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, FriendshipRequestsModel_1.default.find('WHERE user_token = ? AND target_token = ?', [data.user_token, data.gd.targetToken])
                            // L'utilisateur n'a pas encore envoyé de demande d'ami
                        ];
                        case 1:
                            getFriendRequest = _a.sent();
                            // L'utilisateur n'a pas encore envoyé de demande d'ami
                            if (!getFriendRequest) {
                                input = {
                                    token: crypto.createHmac('sha256', 'friendship')
                                        .update(data.user_token + data.gd.targetToken + Helpers_1.default.getDateTime()).digest('hex'),
                                    user_token: data.user_token,
                                    target_token: data.gd.targetToken,
                                    request_date: Helpers_1.default.getDateTime()
                                };
                                FriendshipRequestsModel_1.default.save(input);
                                // Si l'utilisateur a déjà envoyé une demande d'ami
                            }
                            else {
                                console.log('friend request already sent');
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('catch-friend-requests', function (token) {
                socket.emit('before-display-friend-requests', token);
            });
            socket.on('get-friend-requests', function (token) {
                // Recupérer les demandes d'amis
                DataAccess_1.default.connection.query('SELECT * FROM ' + _this.friendshipRequestsTable + ' WHERE target_token = ?', [token], function (err, rows) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _i, i, emitter, emitterData, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(rows.length > 0)) return [3 /*break*/, 6];
                                _a = [];
                                for (_b in rows)
                                    _a.push(_b);
                                _i = 0;
                                _d.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 5];
                                i = _a[_i];
                                return [4 /*yield*/, UserModel_1.default.findBy('token', rows[i].user_token)];
                            case 2:
                                emitter = _d.sent();
                                _c = {
                                    username: emitter.username,
                                    token: emitter.token
                                };
                                return [4 /*yield*/, User_1.default.getAvatar(emitter.token)];
                            case 3:
                                emitterData = (_c.avatar = _d.sent(),
                                    _c);
                                socket.emit('display-friend-requests', { friendRequest: rows[i], emitter: emitterData });
                                _d.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 1];
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                socket.emit('no-friend-request');
                                _d.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    };
    // Si l'utilisateur a reçu des requêtes d'ami
    Friendship.prototype.hasUnreadFriendRequests = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var getFriendshipRequests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, FriendshipRequestsModel_1.default.find('WHERE target_token = ? AND viewed  = ?', [token, 0])];
                    case 1:
                        getFriendshipRequests = _a.sent();
                        getFriendshipRequests ? resolve(true) : resolve(false);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Obtenir le nombre de demandes d'amis
    Friendship.prototype.countUnreadFriendRequests = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var getFriendshipRequestsCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, FriendshipRequestsModel_1.default.count('WHERE target_token = ? AND viewed = ?', [token, 0])];
                    case 1:
                        getFriendshipRequestsCount = _a.sent();
                        resolve(getFriendshipRequestsCount);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Si l'utilisateur a demandé un membre en ami
    Friendship.prototype.hasRequested = function (token, target) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var hasRequested;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token && target)) return [3 /*break*/, 2];
                        return [4 /*yield*/, FriendshipRequestsModel_1.default.find('WHERE user_token = ? AND target_token = ?', [token, target])];
                    case 1:
                        hasRequested = _a.sent();
                        hasRequested ? resolve(true) : resolve(false);
                        return [3 /*break*/, 3];
                    case 2:
                        resolve(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    // Si deux utilisateurs sont amis
    Friendship.prototype.areFriend = function (token, friend) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var hasRequested;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token && friend)) return [3 /*break*/, 2];
                        return [4 /*yield*/, FriendshipModel_1.default.find('WHERE user_token = ? AND friend_token = ?', [token, friend])];
                    case 1:
                        hasRequested = _a.sent();
                        hasRequested ? resolve(true) : resolve(false);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    return Friendship;
}());
exports.Friendship = Friendship;
exports.default = new Friendship;
