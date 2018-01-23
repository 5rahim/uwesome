import Notify from "./core/Notify";
import User from "./core/User";

export class Locals {

    public init(app) {

        app.use( async (req, res, next) => {
            res.locals.currentUserHasUnreadFriendRequests = await Notify.hasUnreadFriendRequests(req)
            res.locals.currentUserUnreadFriendRequestsCount = await Notify.countUnreadFriendRequests(req)
            res.locals.currentUserAvatar = await User.getAvatar(req.session.user)
            res.locals.req = req
            res.locals.csrfToken = req.csrfToken()
            next()
        })

    }

}

export default new Locals