import {Router, Request, Response, NextFunction} from 'express';
import Door from '../../core/Door';
import UserModel from '../../app/Models/UserModel';
import Helpers from "../../core/Helpers";
import Notify from "../../core/Notify";

export class ProfileController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes;
    }

    public profileGradient(type: string): Promise<string> {

        return new Promise((resolve, reject) => {

            switch(type) {
                case 'DEFAULT':
                    resolve('background: linear-gradient(to top right, #2980b9, #1abc9c)')
                    break;
                case 'FLOW':
                    ''
                    break;
                case 'PINKY':
                    ''
            }

        })

    }

    public routes() {

        this.router.get('/user/:username', Door.authRequired, async (req: any, res, next) => {

            const pUser: any = await UserModel.findBy('username', req.params.username)

            if (pUser) {

                // Si le token de l'utilisateur sur le profil est le même que celui de l'utilisateur actuel
                const isCurrentUserProfile: boolean = pUser.token == req.session.user

                const data = {
                    pageTitle: 'profile %s',
                    req: req,
                    csrfToken: req.csrfToken(),
                    user: await Door.getUser(req),
                    pUser: pUser,
                    Notify: Notify,
                    profileGradient: await this.profileGradient(pUser.profile_gradient),
                    isCurrentUserProfile: isCurrentUserProfile
                }

                res.render('user/index', data);

            } else {

                res.redirect('back')

            }

        })

    }

}

const ProfileRoutes = new ProfileController();
ProfileRoutes.routes();

export default ProfileRoutes.router;