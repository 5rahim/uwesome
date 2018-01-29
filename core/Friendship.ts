import FriendshipRequestsModel from "../app/Models/FriendshipRequestsModel";
import FriendshipModel from "../app/Models/FriendshipModel";
import Helpers from "./Helpers";
import UserModel from "../app/Models/UserModel";
import DB from "./DataAccess";
import User from "./User";
const crypto = require('crypto')

export class Friendship {

    private friendshipRequestsTable: string;
    private friendshipTable: string;

    public constructor() {

        this.friendshipRequestsTable = "friendship_requests"
        this.friendshipTable = "friendship"

    }

    public initialize(io) {

        io.sockets.on('connection', (socket: any): any => {

            // Friend Requests
            socket.on('friend-request', async (data) => {

                const getFriendRequest = await FriendshipRequestsModel.find('WHERE user_token = ? AND target_token = ?', [data.user_token,data.gd.targetToken])

                // L'utilisateur n'a pas encore envoyé de demande d'ami
                if(!getFriendRequest) {

                    const input = {
                        token: crypto.createHmac('sha256', 'friendship')
                            .update(data.user_token + data.gd.targetToken + Helpers.getDateTime()).digest('hex'),
                        user_token: data.user_token,
                        target_token: data.gd.targetToken,
                        request_date: Helpers.getDateTime()
                    }
                    FriendshipRequestsModel.save(input)

                    // Si l'utilisateur a déjà envoyé une demande d'ami
                } else {

                    console.log('friend request already sent')

                }

            })


            socket.on('catch-friend-requests', (token) => {

                socket.emit('before-display-friend-requests', token)


            })

            socket.on('get-friend-requests', (token) => {

                // Recupérer les demandes d'amis
                DB.connection.query('SELECT * FROM '+ this.friendshipRequestsTable +' WHERE target_token = ?', [token], async (err, rows) => {

                    if(rows.length > 0) {

                        for(var i in rows) {

                            const emitter: any = await UserModel.findBy('token', rows[i].user_token)

                            const emitterData = {
                                username: emitter.username,
                                token: emitter.token,
                                avatar: await User.getAvatar(emitter.token)
                            }

                            socket.emit('display-friend-requests', { friendRequest: rows[i], emitter: emitterData })

                        }

                    } else {

                        socket.emit('no-friend-request')

                    }

                })

            })

        });

    }

    // Si l'utilisateur a reçu des requêtes d'ami
    public hasUnreadFriendRequests(token){

        return new Promise( async (resolve, reject) => {

            const getFriendshipRequests = await FriendshipRequestsModel.find('WHERE target_token = ? AND viewed  = ?', [token, 0])

            getFriendshipRequests ? resolve(true) : resolve(false)

        })

    }

    // Obtenir le nombre de demandes d'amis
    public countUnreadFriendRequests(token) {

        return new Promise( async (resolve, reject) => {

            const getFriendshipRequestsCount = await FriendshipRequestsModel.count('WHERE target_token = ? AND viewed = ?', [token, 0])

            resolve(getFriendshipRequestsCount)

        })

    }

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