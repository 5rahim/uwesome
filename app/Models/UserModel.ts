import { Model } from '../../core/Model';

export class UserModel extends Model {

    constructor() {
        super('users');
    }

}

export default new UserModel;