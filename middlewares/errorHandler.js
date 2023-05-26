import { DEBUG_MODE } from '../config';
import { ValidationError } from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';

const errorHandler = (err, req, res, next) => {
    // Define a default status code
    let statusCode = 500;

    // Now to send the error to the client we need to send 2 things (statusCode, errorMsg)
    // Here also for prod scenario don't send confidential exact error to client (err.message)
    // Default error data msg
    let data = {
        message: 'Internal server error',
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
    }

    // This class provided by Joi lib
    if(err instanceof ValidationError) {
        statusCode = 422; // This 422 is used for validation errors, 400 Client bad request
        data = {
            message: err.message
        }
    }

    // Check if instance of our newly created CustomErrorHandler
    if(err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
};

export default errorHandler;