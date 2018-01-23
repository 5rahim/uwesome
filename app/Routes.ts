import { Router } from 'express';
import HomeController from "./Controllers/HomeController";
import LangController from "./Controllers/LangController";
import FazeController from "./Controllers/FazeController";
import ProfileController from "./Controllers/ProfileController";
import Locals from "../Locals";

export class Routes {

    public initialize(app) {

        let router: Router;
        router = Router();

        // Locals
        Locals.init(app)

        // Routes
        app.use('/', HomeController);
        app.use('/faze', FazeController);
        app.use('/lang', LangController);
        app.use('/', ProfileController);

    }

}

export default new Routes;