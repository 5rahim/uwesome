export class Helpers {

    public getDateTime() {

        const datetime = new Date().toISOString().substr(0, 19).replace('T', ' ');
        return datetime;

    }

}

export default new Helpers;