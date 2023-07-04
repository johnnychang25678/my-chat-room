import Db from "../infrastructure/db.js";

export default class UserModel {
    constructor() {
        const dbInstance = Db.getDbInstance();
        this.db = dbInstance.collection("users");

        this.insert = this.insert.bind(this);
    }

    _toUserEntity(user) {
        const now = new Date();
        return { ...user, create_time: now, update_time: now };
    }

    async insert(user) {
        const userEntity = this._toUserEntity(user);
        const res = await this.db.insertOne(userEntity);
        return res;
    }

    async selectByUserName(userName) {
        const queryResult = await this.db.find({ username: userName });
        const res = await queryResult.toArray();
        return res[0];
    }
}