import express from "express";
import UserController from "./controllers/userController.js";
import ViewController from "./controllers/viewController.js";
import { auth, isLogin } from "./middlewares.js";

export default class MyRouter {
    constructor() {
        this.router = express.Router();

        // pages
        const viewController = new ViewController();
        this.router.get("/", isLogin, viewController.loginPage);
        this.router.get("/chat-room", auth, viewController.chatPage);

        // user api
        const userController = new UserController();
        this.router.post("/user/login", userController.login);
        this.router.get("/user/name", auth, userController.getName);
        this.router.post("/user/register", userController.login);

        // TODO: chat api

        this.route = this.route.bind(this);
    }

    route() {
        return this.router;
    }


}