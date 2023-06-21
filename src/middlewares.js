import Utils from "./utils.js";
import { MyError, MyErrorType } from "./errors.js";

export const auth = (req, res, next) => {
    const cookieString = req.headers.cookie;
    if (!cookieString) {
        return next(new MyError(MyErrorType.TOKEN_AUTH_ERROR));
    }
    // parse cookie
    const cookies = Utils.cookieParser(cookieString);
    const token = cookies["token"];
    try {
        const plainToken = Utils.verifyToken(token);
        const { username } = plainToken;
        req.username = username; // attach to request and pass to the next handler
        return next();
    } catch (err) {
        return next(err);
    }
};

// if login, redirect to chat-room page
export const isLogin = (req, res, next) => {
    const cookieString = req.headers.cookie;
    if (!cookieString) {
        return next();
    }
    const cookies = Utils.cookieParser(cookieString);
    const token = cookies["token"];
    try {
        Utils.verifyToken(token);
        return res.redirect(302, "/chat-room");
    } catch (err) {
        return next();
    }
};


// trigger if any handler calls next(err)
export const errorHandler = (err, req, res, next) => {
    // refer to errors.js MyError    
    console.log("*********** error ***************");
    console.log(err.type);
    console.log(err.error);
    const myErrorMessage = err.message();
    res.redirect(302, `/?error=${encodeURIComponent(myErrorMessage)}`);
};

