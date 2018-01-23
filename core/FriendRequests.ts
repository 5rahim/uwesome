import FriendshipRequestsModel from "../app/Models/FriendshipRequestsModel";
import Helpers from "./Helpers";
const crypto = require('crypto')

export class FriendRequests {

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

        });

    }

}

export default new FriendRequests;