import jwt from "jsonwebtoken";
import { MyError, MyErrorType } from "../errors.js";
import bcrypt from "bcrypt";

export default class UserController {
    constructor(userModel) {
        this.TOKEN_EXPIRE = 60 * 60; // one hour
        this.userModel = userModel;
        // console.log("userModel", userModel);

        // bind to make sure "this" is correctly pointing to the UserController class
        // if remove this line, fields accessed thru methods become undefined, because the caller is not UserController class
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
    }
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await this.userModel.selectByUserName(username);
            if (!user) {
                return next(new MyError(MyErrorType.INCORRECT_AUTH_ERROR));
            }
            console.log(user);
            // verify password
            if (!bcrypt.compareSync(password, user.password)) {
                return next(new MyError(MyErrorType.INCORRECT_AUTH_ERROR));
            }

            // create jwt and send to frontend
            // set cookie then redirect
            const token = jwt.sign({ username: username }, "secret", { expiresIn: this.TOKEN_EXPIRE });
            res.cookie("token", token, { httpOnly: true });
            res.redirect("../chat-room");
        } catch (err) {
            const myError = new MyError(err, MyErrorType.INTERNAL_SERVER_ERROR);
            next(myError);
        }
    }
    async getName(req, res, next) {
        try {
            res.json({ username: req.username });
        } catch (err) {
            const myError = new MyError(err, MyErrorType.INTERNAL_SERVER_ERROR);
            next(myError);
        }
    }
    async signUp(req, res, next) {
        try {
            // check if already in db
            const { username, password } = req.body;
            const user = await this.userModel.selectByUserName(username);
            console.log(user);
            if (user) {
                return next(new MyError(MyErrorType.USER_ALREADY_EXIST));
            }
            // hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = bcrypt.hashSync(password, salt);
            // insert to db
            await this.userModel.insert({ username, password: hashedPwd });
            res.redirect(302, `/?registerSuccess=${encodeURIComponent("Register success! Please login")}`);
        } catch (err) {
            const myError = new MyError(err, MyErrorType.INTERNAL_SERVER_ERROR);
            next(myError);
        }

    }
}