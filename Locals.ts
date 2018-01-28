import Notify from "./core/Notify";
import User from "./core/User";
import Friendship from "./core/Friendship";

export class Locals {

    public init(app) {

        app.use( async (req, res, next) => {
            res.locals.currentUserHasUnreadFriendRequests = await Friendship.hasUnreadFriendRequests(req.session.user)
            res.locals.currentUserUnreadFriendRequestsCount = await Friendship.countUnreadFriendRequests(req.session.user)
            res.locals.currentUserAvatar = await User.getAvatar(req.session.user)
            res.locals.req = req
            res.locals.csrfToken = req.csrfToken()
            next()
        })

    }

}

export default new Locals