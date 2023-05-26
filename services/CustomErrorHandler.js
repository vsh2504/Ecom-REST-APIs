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
}

export default CustomErrorHandler;