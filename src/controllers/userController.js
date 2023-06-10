import jwt from "jsonwebtoken";
import { MyError, MyErrorType } from "../errors.js";

export default class UserController {
    constructor() {
        this.TOKEN_EXPIRE = 60 * 60; // one hour

        // bind to make sure "this" is correctly pointing to the UserController class
        // if remove this line, fields accessed thru methods become undefined, because the caller is not UserController class
        this.login = this.login.bind(this);
    }
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            console.log(username, password);
            // TODO: verify username password

            // create jwt and send to frontend
            // set cookie then redirect
            const token = jwt.sign({ foo: "bar" }, "secret", { expiresIn: this.TOKEN_EXPIRE });
            res.cookie("token", token, { httpOnly: true });
            res.redirect("../chat-room");
        } catch (err) {
            const myError = new MyError(err, MyErrorType.INTERNAL_SERVER_ERROR);
            next(myError);
        }
    }

}