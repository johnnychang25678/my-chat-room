import Db from "../infrastructure/db.js";

export default class MessageModel {
    constructor() {
        const dbInstance = Db.getDbInstance();
        this.db = dbInstance.collection("messages");

        this.insert = this.insert.bind(this);
    }


    async insert(message) {
        const res = await this.db.insertOne(message);
        return res;
    }

    async selectAll() {
        const queryResult = await this.db
            .find({}, { projection: { _id: 0 } })
            .sort({ timestamp: 1 });
        const res = await queryResult.toArray();
        return res;
    }
}