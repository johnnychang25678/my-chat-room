import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { ExpressHandlebars } from "express-handlebars";
import MyRouter from "./routes.js";
import { errorHandler } from "./middlewares.js";
import Db from "./infrastructure/db.js";
import MessageModel from "./models/messageModel.js";
import UserModel from "./models/userModel.js";
import SocketIO from "./socketio/SocketIO.js";


export default class App {
    constructor() {
        this.app = express();
    }

    async run(port) {
        if (!port) {
            throw new Error("port is required");
        }
        await new Db().connect();
        if (Db.dbInstance != null) {
            console.log("connected to db!");
        } else {
            throw new Error("db instance error");
        }

        // static files
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.app.use(express.static(path.join(__dirname, "public")));

        // set up view engine
        this.app.set("views", path.join(__dirname, "views"));
        const exhbs = new ExpressHandlebars();
        exhbs.defaultLayout = "main"; // views/layouts/main.hbs
        this.app.engine("handlebars", exhbs.engine);
        this.app.set("view engine", "handlebars");

        this.app.use(express.urlencoded({ extended: true }));

        this.app.use("/", new MyRouter().route());
        // error handling middleware, use next(MyError) to handle 
        this.app.use(errorHandler);

        const server = http.createServer(this.app);

        // socket io init
        const socketIO = new SocketIO(server, new MessageModel(), new UserModel());
        socketIO.init();

        server.listen(port, () => console.log("server running on port %d", port));
    }
}