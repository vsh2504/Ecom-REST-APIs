class CustomErrorHandler extends Error {
    constructor(status, msg) {
        // We need to call the constructor of parent/super class
        super();
        this.status = status;
        this.message = msg;
    }

    // Don't need to create an instance of class to call the static method
    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }

    // 401 -> Unauthorized
    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    // 401 -> Unauthorized
    static unAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(401, message);
    }
}

export default CustomErrorHandler;