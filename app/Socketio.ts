import UserModel from "./Models/UserModel";

export class Socketio {

    public initialize(io) {

        let users = []

        io.sockets.on('connection', (socket: any): any => {

            socket.on('init', async token => {

                const user: any = await UserModel.findBy('token', token)

                users.push(user.token)

                let currentUser = users.indexOf(user.token)


                socket.on('disconnect', () => {
                    users.splice(currentUser, 1)
                })

                //console.log(users)

            })

        })

    }

}

export default new Socketio;