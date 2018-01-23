import {Router, Request, Response, NextFunction} from 'express';
import * as bcrypt from 'bcryptjs';
import Helpers from './Helpers';
import UserModel from '../app/Models/UserModel';
const crypto = require('crypto')
import {Result} from "express-validator/shared-typings";

export class Door {

    secret: string

    constructor() {
        this.secret = 'uwelovesome'
    }

    private renderWelcome(req, res, registerErrors: any, loginErrors: any): void {

        res.render('home/welcome', { pageTitle: 'welcome' , csrfToken: req.csrfToken(), errors: registerErrors, loginErrors: loginErrors, req: req })

    }

    // Inscription
    public async register(req, res) {

        // Verifier les champs
        req.checkBody('username', 'rUsernameEmpty').notEmpty()
        req.checkBody('username', 'rUsernameAlpha').isAlphanumeric()
        req.checkBody('email', 'rEmailEmpty').notEmpty()
        req.checkBody('email', 'rEmail').isEmail()
        req.checkBody('password', 'rPasswordEmpty').notEmpty()
        req.checkBody('password', 'rPassportLength').isLength(6, 99)
        req.assert('password', 'rPasswordEq').equals(req.body.passwordcf)

        req.sanitize('username').trim()


        const errors = req.validationErrors();

        // Si il y a une erreur dans le formulaire
        if (errors) {

            // Retourner la page d'inscription
            this.renderWelcome(req, res, errors, '')

        } else {

            // On recherche un utilisateur avec le même email
            let existUserWithEmail = await UserModel.findBy('email', req.body.email)

            if (existUserWithEmail) {

                // On retourne la page de bienvenue
                this.renderWelcome(req, res, [{msg: 'rEmailArleadyTaken'}], '')

            } else {

                // On recherche un utilisateur avec le même pseudonyme
                let existUserWithUsername = await UserModel.findBy('email', req.body.username)

                if (existUserWithUsername) {

                    // On retourne la page de bienvenue
                    this.renderWelcome(req, res, [{msg: 'rUsernameArleadyTaken'}], '')

                } else {

                    const input = {
                        username: req.body.username,
                        email: req.body.email,
                        avatar: process.env.DEFAULT_AVATAR,
                        profile_gradient: process.env.DEFAULT_PROFILE_GRADIENT,
                        //token: bcrypt.hashSync(req.body.email + Helpers.getDateTime(), bcrypt.genSaltSync(2), null),
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                        token:  crypto.createHmac('sha256', this.secret)
                            .update(req.body.email + Helpers.getDateTime())
                            .digest('hex'),
                        created_at: Helpers.getDateTime(),
                        validation: 0
                    };

                    // On sauvegarde l'utilisateur
                    UserModel.save(input)

                    // On recupère l'utilisateur
                    const user: any = await UserModel.findBy('username', req.body.username)

                    // Sessions
                    this.initSessions(req, res, user)

                    // Rediriger vers Faze en fonction de la validation
                    this.toFaze(res, user.validation)

                }

            }

        }


    }

    // Connexion
    public async login(req, res) {

        req.checkBody('username', 'rUsernameEmpty').notEmpty()
        req.checkBody('password', 'rPasswordEmpty').notEmpty()

        const errors = req.validationErrors();

        // Si il y a une erreur dans le formulaire
        if(errors) {

            // Retourner la page de connexion
            this.renderWelcome(req, res, '', errors)

        } else {

            // Rechercher l'utilisateur demandé
            const user: any = await UserModel.findBy('username', req.body.username)

            if(user) {

                // Si les mots de passe correspondent
                if(bcrypt.compareSync(req.body.password, user.password)) {

                    // On initialise les sessions
                    this.initSessions(req, res, user)

                    // On redirige en fonction de la validation
                    this.toFaze(res, user.validation)

                } else {

                    // Retourner la page de connexion
                    this.renderWelcome(req, res, '',  [{msg: 'rIncorrectPassword'}])

                }

            } else {

                // Retourner la page de connexion
                this.renderWelcome(req, res, '',  [{msg: 'unknowUser'}])

            }

        }

    }

    // Initialiser les sessions et cookies
    private initSessions(req, res, user) {

        req.session.user = user.token;
        req.session.validation = user.validation;
        res.cookie('user_stoken', user.token, {maxAge: 2628000000, httpOnly: true});

    }

    // On récupère les informations de l'utilisateur actuel
    public getUser(req): Promise<any> {

        // Si l'utilisateur est connecté
        if(this.isAuth) {

            return new Promise((resolve, reject) => {

                const user = UserModel.findBy('token', req.session.user)

                resolve(user)

            })

        }

    }

    // Recupérer le token
    public getToken(req) {

        if(this.isAuth)
            return req.session.user
        else
            return ''

    }

    // Si l'utilisateur est connecté ou pas
    public isAuth(req) {

        return (req.session.user && req.cookies.user_stoken)

    }

    // Rediriger vers Faze en fonction de la validation
    public toFaze(res, validation: number) {

        if(validation == 0) {
            return res.redirect('/faze')
        } else {
            return res.redirect('/')
        }

    }

    // Middleware de verification des sessions et des cookies
    public checkSessionAndCookie(req, res, next) {

        // Si il y a un cookie du token mais pas de session
        if (req.cookies.user_stoken && !req.session.user) {

            if(process.env.ENV == 'prod')
                res.clearCookie('user_stoken')
            else if (process.env.ENV == 'dev')
                req.session.user = req.cookies.user_stoken

            // Si le cookie du token est différent de la session
            // Pour prevenir une tentative de modification du token via le navigateur
        } else if(req.cookies.user_stoken !== req.session.user) {

            res.clearCookie('user_stoken')
            req.session.destroy((err) => {})

        }

        next();

    }

    public noAuthRequired(req, res, next) {

        if (req.session.user && req.cookies.user_stoken) {
            return res.redirect('/');
        } else {
            next();
        }

    }

    // Besoin que la session utilisateur existe
    public authRequired(req, res, next) {

        // Si l'utilisateur n'est pas connecté
        if (!req.session.user) {

            // On le redirige vers la page de bienvenue
            return res.redirect('/welcome');

        } else {

            // Si l'utilisateur n'est validé
            if(req.session.validation == 0) {
                // On le redirige vers Faze
                return res.redirect('/faze');
            } else {
                next()
            }

        }

    }

    // Besoin qu'une session existe pour Faze
    public authRequiredForFaze(req, res, next) {

        // Si l'utilisateur n'est pas connecté
        if (!req.session.user) {

            return res.redirect('/welcome');

        } else {

            // Si l'utilisateur est validé on le redirige vers l'accueil
            if(req.session.validation == 1) {
                return res.redirect('/');
            } else {
                next()
            }

        }

    }

    // Valider un utilisateur
    public validate(req, res) {

        if(req.cookies.user_stoken && req.session.user) {

            UserModel.update('validation', 1, req.session.user)
            req.session.validation = 1
            return res.redirect('/')

        } else {

            return res.redirect('/welcome')

        }

    }

    // Déconnexion
    public logout(req, res) {

        // On verifie si les sessions et cookies existe
        if(this.isAuth(req)) {
            // On supprime le cookie
            res.clearCookie('user_stoken')
            // On supprime les sessions
            req.session.destroy((err) => {})
            // On redirige vers la page de bienvenue
            return res.redirect('/welcome')
        } else {
            // On redirige vers la page de bienvenue
            return res.redirect('/welcome')
        }

    }

}

export default new Door;