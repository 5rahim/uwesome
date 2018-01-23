import FriendshipRequestsModel from "../app/Models/FriendshipRequestsModel";
import FriendshipModel from "../app/Models/FriendshipModel";

export class Friendship {

    // Si l'utilisateur a demandé un membre en ami
    public hasRequested(token, target) {

        return new Promise( async (resolve, reject) => {

            if(token && target) {

                const hasRequested = await FriendshipRequestsModel.find('WHERE user_token = ? AND target_token = ?', [token, target])
                hasRequested ? resolve(true) : resolve(false)

            } else {
                resolve(false)
            }

        })

    }

    // Si deux utilisateurs sont amis
    public areFriend(token, friend) {

        return new Promise( async (resolve, reject) => {

            if(token && friend) {

                const hasRequested = await FriendshipModel.find('WHERE user_token = ? AND friend_token = ?', [token, friend])
                hasRequested ? resolve(true) : resolve(false)

            }

        })

    }

}

export default new Friendship