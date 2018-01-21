import {Router, Request, Response, NextFunction} from 'express';

export class LangController {

    maxAge: number
    router: Router

    constructor() {
        this.router = Router()
        this.routes
        this.maxAge = 9999999999999999
    }

    public routes() {

        this.router.get('/en', (req, res, next) => {

            res.cookie('ilang', 'en', {maxAge: this.maxAge, httpOnly: true})
            res.redirect('/')

        });

        this.router.get('/fr', (req, res, next) => {

            res.cookie('ilang', 'fr', {maxAge: this.maxAge, httpOnly: true})
            res.redirect('/')

        });

    }

}

let LangRoutes = new LangController();
LangRoutes.routes();

export default LangRoutes.router;