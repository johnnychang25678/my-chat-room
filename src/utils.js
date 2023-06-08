export default class Utils {
    static cookieParser(cookieString) {
        // token=xxx; aa=bb
        const output = {};
        if (!cookieString) return output;
        cookieString.split(";")
            .map(cookieKeyVal => cookieKeyVal.trim().split("="))
            .forEach(splited => output[splited[0]] = splited[1]);

        console.log("cookie:", output);
        return output;
    }
}