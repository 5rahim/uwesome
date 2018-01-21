import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as path from 'path';
import * as expressValidator from 'express-validator';
import * as sassMiddleware from 'node-sass-middleware';
import * as i18n from 'i18n';
import * as session from 'express-session';
import * as flash from 'connect-flash';

// Core/App
import Config from "./core/Config";
import DB from "./core/DataAccess";
import View from "./core/View";
import Routes from "./app/Routes";
import I18n from './core/i18n';
import Door from './core/Door';
import server = require("socket.io");

// Process ENV
process.env.BASE = __dirname + '/';

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): any {

        Config.start()

        // MySQL Database initialization
        DB.initialize();

        // View initialization
        View.initialize(this.app, path);

        // Middleware
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(csrf({ cookie: true }));
        this.app.use(expressValidator());
        this.app.use(sassMiddleware({
            src: path.join(__dirname, 'assets'),
            dest: path.join(__dirname, 'assets'),
            indentedSyntax: false, // true = .sass and false = .scss
            sourceMap: true
        }));
        this.app.use(express.static(path.join(__dirname, 'assets')));
        this.app.use(express.static(path.join(__dirname, 'node_modules')));
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(session({
            secret: 'redbeardisthebest',
            resave: false,
            saveUninitialized: false,
            cookie: { expires: 2628000000 }
            }));
        this.app.use((req, res, next) => {
            Door.checkSessionAndCookie(req, res, next)
        });
        this.app.use(flash());
        this.app.use(i18n.init);
        I18n.configure(i18n);


        // Cors
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4003');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });

    }

    public routes(): void {

        // All Routes
        Routes.initialize(this.app);

    }

}

export default new Server().app;