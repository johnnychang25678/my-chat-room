import jwt from "jsonwebtoken";

export default class UserController {
    constructor() {
        this.TOKEN_EXPIRE = 60 * 60; // one hour
    }
    async login(req, res) {
        const { username, password } = req.body;
        console.log(username, password);
        // TODO: verify username password

        // create jwt and send to frontend
        // set cookie then redirect
        const token = jwt.sign({ foo: "bar" }, "secret", { expiresIn: this.TOKEN_EXPIRE });
        res.cookie("token", token, { httpOnly: true });
        res.redirect("../chat-room");
    }

}