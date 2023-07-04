import { MongoClient } from "mongodb";

export default class Db {
    constructor() {
        const url = "mongodb://localhost:27017";
        this.client = new MongoClient(url);
        this.dbName = "fse_chat_room";
        this.connect = this.connect.bind(this);
    }

    static dbInstance = null;

    static getDbInstance() {
        return Db.dbInstance;
    }

    // returns db instance
    async connect() {
        await this.client.connect();
        Db.dbInstance = this.client.db(this.dbName);
        if (!Db.dbInstance) throw new Error("db connection went wrong");
    }
}