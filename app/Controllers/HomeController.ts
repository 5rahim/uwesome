import {Router, Request, Response, NextFunction} from 'express';
import Door from '../../core/Door';
import UserModel from '../../app/Models/UserModel';
import Validator from "../../core/Validator";
import Notify from "../../core/Notify";

export class HomeController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes;
    }

    // Rendre la page Welcome
    private renderWelcome(req, res) {

        const data = {
            pageTitle: 'welcome',
            csrfToken: req.csrfToken(),
            errors: '',
            loginErrors: '',
            req: req
        }

        res.render('home/welcome', data);

    }

    public routes() {

        // Page accueil
        this.router.get('/', Door.authRequired, async (req: any, res, next) => {

            const data = {
                pageTitle: 'home',
                req: req,
                csrfToken: req.csrfToken(),
                user: await UserModel.findBy('token', req.session.user),
                Notify: Notify
            }

            res.render('home/index', data);

        });

        this.router.post('/signup', (req, res, next) => {

            Door.register(req, res)

        })

        this.router.post('/login', (req, res, next) => {

            Door.login(req, res)

        })

        this.router.post('/validation', (req, res, next) => {

            Door.validate(req, res)

        })

        this.router.get('/logout', (req, res, next) => {

            Door.logout(req, res)

        })

        this.router.get('/welcome', Door.noAuthRequired, (req, res, next) => {

            this.renderWelcome(req, res)

        })

        this.router.get('/signup', (req, res, next) => {

            res.redirect('welcome')

        })

        this.router.get('/login', (req, res, next) => {

            res.redirect('welcome')

        })



    }

}

const HomeRoutes = new HomeController();
HomeRoutes.routes();

export default HomeRoutes.router;