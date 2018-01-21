export class i18n {

    public configure(i18n) {

        // Configuration de i18n
        i18n.configure({
            locales:['en', 'fr'],
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

    }

}

export default new i18n;