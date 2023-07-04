export class MyError {
    constructor(err, type) {
        // constructor overloading
        if (arguments.length == 1) {
            this.error = new Error("custom error");
            this.type = arguments[0];
        } else {
            this.error = err; // original error object
            this.type = type; // custom error type
        }
    }

    message() {
        switch (this.type) {
            case MyErrorType.TOKEN_AUTH_ERROR:
                return "Please login again";
            case MyErrorType.INCORRECT_AUTH_ERROR:
                return "Incorrect username or password";
            case MyErrorType.USER_ALREADY_EXIST:
                return "User name already existed";
            case MyErrorType.INTERNAL_SERVER_ERROR:
            default:
                return "Something went wrong";
        }
    }

}

export class MyErrorType {
    static TOKEN_AUTH_ERROR = "TOKEN_AUTH_ERROR";
    static INCORRECT_AUTH_ERROR = "INCORRECT_AUTH_ERROR";
    static INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
    static USER_ALREADY_EXIST = "USER_ALREADY_EXIST";
}