"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var i18n = /** @class */ (function () {
    function i18n() {
    }
    i18n.prototype.configure = function (i18n) {
        // Configuration de i18n
        i18n.configure({
            locales: ['en', 'fr'],
            directory: __dirname + '/Locales',
            defaultLocale: 'fr',
            register: global,
            cookie: 'ilang',
            logDebugFn: function (msg) {
                console.log('debug', msg);
            },
            logWarnFn: function (msg) {
                console.log('warn', msg);
            },
            logErrorFn: function (msg) {
                console.log('error', msg);
            }
        });
    };
    return i18n;
}());
exports.i18n = i18n;
exports.default = new i18n;
