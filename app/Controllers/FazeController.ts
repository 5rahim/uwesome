import {Router, Request, Response, NextFunction} from 'express';
import Door from '../../core/Door';

export class FazeController {

    router: Router;

    constructor() {
        this.router = Router()
        this.routes
    }

    private renderFaze(req, res) {

        res.render('home/faze', { pageTitle: 'Faze' , errors: '', csrfToken: req.csrfToken(), req: req })

    }

    public routes() {

        this.router.get('/', Door.authRequiredForFaze, (req, res, next) => {

            this.renderFaze(req, res)

        })

    }

}

let FazeRoutes = new FazeController();
FazeRoutes.routes();

export default FazeRoutes.router;