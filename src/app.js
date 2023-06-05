import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { ExpressHandlebars } from "express-handlebars";


export default class App {
    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const app = express();

        // console.log(path.join(__dirname, "public"));
        // static files
        app.use(express.static(path.join(__dirname, "public")));

        // set up view engine
        app.set("views", path.join(__dirname, "views"));
        const exhbs = new ExpressHandlebars();
        exhbs.defaultLayout = "main"; // views/layouts/main.hbs
        app.engine("handlebars", exhbs.engine);
        app.set("view engine", "handlebars");


        app.get("/", (req, res) => {
            res.render("index");
        });
        this.app = app;
    }

    listen(port) {
        if (!port) {
            throw new Error("port is required");
        }
        this.app.listen(port, () => console.log("running on port %d", port));
    }
}