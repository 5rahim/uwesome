import FriendshipRequestsModel from "../app/Models/FriendshipRequestsModel";

export class Notify {

    // Si l'utilisateur a reçu des requêtes d'ami
    public hasUnreadFriendRequests(req){

            return new Promise( async (resolve, reject) => {

                const getFriendshipRequests = await FriendshipRequestsModel.findBy('target_token', req.session.user)

                getFriendshipRequests ? resolve(true) : resolve(false)

            })

    }

    // Obtenir le nombre de demandes d'amis
   public countUnreadFriendRequests(req) {

       return new Promise( async (resolve, reject) => {

           const getFriendshipRequestsCount = await FriendshipRequestsModel.countBy('target_token', req.session.user)

           resolve(getFriendshipRequestsCount)

       })

   }

}

export default new Notify;