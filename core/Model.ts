import DB from "./DataAccess";

export class Model {

    table: string;

    constructor(table) {
        this.table = table;
    }

    public getTable() {
        return this.table;
    }

    public findBy(key: string, value: any): Promise<object> {

        return new Promise((resolve, reject) => {

            DB.connection.query('SELECT * FROM '+ this.table +' WHERE '+ key +' = ? LIMIT 1', [value], (err, rows) => {

                if(err)
                    reject(err)

                if(rows)
                    resolve(rows[0])
                else
                    resolve(null)

            });

        })

    }

    public find(query: string, value: any) {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM '+ this.table +' ' + query

            DB.connection.query(sql, value, (err, rows) => {

                if(err)
                    reject(err)

                if(rows)
                    resolve(rows[0])

            });

        })

    }


    public get(column: string, key: string, value: string) {

        return new Promise((resolve, reject) => {

            DB.connection.query('SELECT '+ column +' FROM '+ this.table +' WHERE '+ key +' = ? LIMIT 1', [value], (err, rows) => {

                if(err)
                    reject(err)

                resolve(rows[0])

            });

        })

    }

    public save(input) {

        DB.connection.query('INSERT INTO '+ this.table +' SET ?', [input], function (err, rows) {

            if(err)
                console.log(err)

        });

    }

    public update(key: string, value: any, token: string) {

        DB.connection.query('UPDATE '+ this.table +' SET '+ key +' = ? WHERE token = ?', [value,token], (err, rows) => {

            if(err)
                console.log(err)

        });

    }

    public exist(key, value) {

        return new Promise((resolve, reject) => {

            DB.connection.query('SELECT * FROM '+ this.table +' WHERE '+ key +' = ? LIMIT 1', [value], (err, rows) => {

                if(err)
                    reject(err)

                if(rows[0])
                    resolve(true)
                else
                    resolve(false)

            });

        })

    }

}