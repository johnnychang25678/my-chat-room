import jwt from "jsonwebtoken";
import Utils from "./utils.js";

export const auth = (req, res, next) => {
    console.log("auth");
    const cookieString = req.headers.cookie;
    if (!cookieString) {
        // throw error
    }
    // parse cookie
    const cookies = Utils.cookieParser(cookieString);
    console.log("cookies", cookies);
    const token = cookies["token"];
    if (!token) {
        // throw error
    }
    try {
        const plainToken = jwt.verify(token, "secret");
        console.log(plainToken);

    } catch (err) {
        res.json({ "a": 1 });
        return;
    }
    next();
};

