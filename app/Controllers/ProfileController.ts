import {Router, Request, Response, NextFunction} from 'express';
import Door from '../../core/Door';
import UserModel from '../../app/Models/UserModel';
import Helpers from "../../core/Helpers";
import User from "../../core/User";
import Friendship from "../../core/Friendship";

export class ProfileController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes;
    }

    public routes() {

        this.router.get('/user/:username', Door.authRequired, async (req: any, res, next) => {

            const pUser: any = await UserModel.findBy('username', req.params.username)

            if (pUser) {

                // Si le token de l'utilisateur sur le profil est le même que celui de l'utilisateur actuel
                const isCurrentUserProfile: boolean = pUser.token == req.session.user

                const data = {
                    pageTitle: 'profile %s',
                    user: await Door.getUser(req),
                    pUser: pUser,
                    profileGradient: await User.getProfileGradient(pUser.token),
                    profileUserAvatar: await User.getAvatar(pUser.token),
                    // Si l'utilisateur a demandé le membre en ami
                    currentUserHasRequested: await Friendship.hasRequested(req.session.user, pUser.token),
                    // Si l'utilisateur est ami avec le membre
                    currentUserIsFriend: await Friendship.areFriend(req.session.user, pUser.token),
                    // Si l'utilisateur a reçu une demande d'ami du membre
                    currentUserHasBeenRequested: await Friendship.hasRequested(pUser.token, req.session.user),
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