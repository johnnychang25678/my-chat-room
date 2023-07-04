import express from "express";
import UserController from "./controllers/userController.js";
import ViewController from "./controllers/viewController.js";
import { auth, isLogin } from "./middlewares.js";
import UserModel from "./models/userModel.js";
import MessageModel from "./models/messageModel.js";
import MessageController from "./controllers/messageController.js";

export default class MyRouter {
    constructor() {
        this.router = express.Router();

        // pages
        const viewController = new ViewController();
        this.router.get("/", isLogin, viewController.loginPage);
        this.router.get("/chat-room", auth, viewController.chatPage);

        // user api
        const userModel = new UserModel();
        const userController = new UserController(userModel);
        this.router.post("/user/login", userController.login);
        this.router.post("/user/register", userController.signUp);
        this.router.get("/user/name", auth, userController.getName);
        this.router.get("/user/logout", auth, userController.logOut);

        // message
        const messageModel = new MessageModel();
        const messageController = new MessageController(messageModel);
        this.router.get("/messages", messageController.getMessages);

        this.route = this.route.bind(this);
    }

    route() {
        return this.router;
    }


}