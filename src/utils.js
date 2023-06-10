import jwt from "jsonwebtoken";
import { MyError, MyErrorType } from "./errors.js";

export default class Utils {
    static cookieParser(cookieString) {
        // token=xxx; aa=bb
        const output = {};
        if (!cookieString) return output;
        cookieString.split(";")
            .map(cookieKeyVal => cookieKeyVal.trim().split("="))
            .forEach(splited => output[splited[0]] = splited[1]);

        return output;
    }

    static verifyToken(token) {
        if (!token) {
            throw new MyError(MyErrorType.TOKEN_AUTH_ERROR);
        }
        let plainToken = "";
        try {
            plainToken = jwt.verify(token, "secret");
        } catch (err) {
            throw new MyError(err, MyErrorType.TOKEN_AUTH_ERROR);
        }

        return plainToken;
    }
}