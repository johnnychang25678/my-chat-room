import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { ExpressHandlebars } from "express-handlebars";
import { Server } from "socket.io";
import MyRouter from "./routes.js";
import { errorHandler } from "./middlewares.js";


export default class App {
    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const app = express();

        // static files
        app.use(express.static(path.join(__dirname, "public")));

        // set up view engine
        app.set("views", path.join(__dirname, "views"));
        const exhbs = new ExpressHandlebars();
        exhbs.defaultLayout = "main"; // views/layouts/main.hbs
        app.engine("handlebars", exhbs.engine);
        app.set("view engine", "handlebars");

        app.use(express.urlencoded({ extended: true }));

        app.use("/", new MyRouter().route());
        // error handling middleware, use next(MyError) to handle 
        app.use(errorHandler);

        this.server = http.createServer(app);

        // set up socket io server, this will expose an endpoint /socket.io/socket.io.js for the client to connect to
        this.io = new Server(this.server);
    }

    run(port) {
        if (!port) {
            throw new Error("port is required");
        }
        this.io.on("connection", (socket) => {
            // socket listens to message from client
            // ioServer sends message to everyone
            socket.on("message", (receive) => {
                // TODO: store in database
                // timestamp should be Z time to store in db
                console.log(receive);
                this.io.emit("message", receive);
            });
        });
        this.server.listen(port, () => console.log("running on port %d", port));
    }
}