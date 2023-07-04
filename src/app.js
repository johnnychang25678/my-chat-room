import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { ExpressHandlebars } from "express-handlebars";
import { Server } from "socket.io";
import MyRouter from "./routes.js";
import { errorHandler } from "./middlewares.js";
import Db from "./infrastructure/db.js";


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
        // set up socket io server, this will expose an endpoint /socket.io/socket.io.js for the client to connect to
        const io = new Server(server);

        io.on("connection", (socket) => {
            // socket listens to message from client
            // ioServer sends message to everyone
            socket.on("message", (receive) => {
                // TODO: store in database
                // timestamp should be Z time to store in db
                console.log(receive);
                this.io.emit("message", receive);
            });
            socket.on("disconnect", () => {
                console.log("disconnect from client");
                socket.disconnect();
            });
        });

        server.listen(port, () => console.log("server running on port %d", port));
    }
}