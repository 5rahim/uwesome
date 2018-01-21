import FriendshipRequestsModel from "../app/Models/FriendshipRequestsModel";

export class Notify {

    // Si l'utilisateur a reçu des requêtes d'ami
    public async hasFriendRequests(req) {

            const getFriendshipRequests = await FriendshipRequestsModel.findBy('target_token', req.session.user);

            return getFriendshipRequests ? true : false

    }

   public countFriendRequests(req) {



   }

}

export default new Notify;