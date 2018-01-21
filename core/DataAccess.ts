import * as mysql from 'mysql';

export class DataAccess {

    public connection;

    constructor() {
        this.initialize();
        this.connection;
    }

    public initialize() {

        // Debuter la connexion à mysql
        this.connection = mysql.createConnection({
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_NAME
        });

        // Logger
        this.connection.connect(function(err){
            if(!err) {
                console.log("Database is connected");
            } else {
                console.log("Error connecting database");
            }
        });

    }

}

export default new DataAccess;