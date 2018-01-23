import UserModel from "../app/Models/UserModel";

export class User {

    public getProfileGradient(userToken): Promise<string> {

        return new Promise( async (resolve, reject) => {

            const token = userToken ? userToken : ''
            const user: any = await UserModel.findBy('token', token)
            const type = user.profile_gradient

            switch(type) {
                case 'DEFAULT':
                    resolve('background: linear-gradient(to top right, #2980b9, #1abc9c)')
                    break;
                case 'FLOW':
                    ''
                    break;
                case 'PINKY':
                    ''
            }

        })

    }

    public getAvatar(user_token) {

        const token = user_token ? user_token : ''

        return new Promise( async (resolve, reject) => {

            // On récupère l'utilisateur
            const user: any = await UserModel.findBy('token', token)

            // Si il existe
            if(user)
                if(user.avatar == 'DEFAULT') {
                    resolve('background: linear-gradient(to top right, #b5b5b5, #dedede)')
                } else {
                    resolve('background-image: url(/images/'+ user.avatar +')')
                }
            else
                resolve('')

        })

    }

}

export default new User