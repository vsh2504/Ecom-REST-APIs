import Joi from 'joi'
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { User } from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import CustomErrorHandler from '../../services/CustomErrorHandler';

const registerController = {
    async register(req, res, next) {
        // Validation of the request
        // Schema for validating the request
        // Joi uses method chaining as validation of fields
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });

        console.log(req.body)
        const { error } = registerSchema.validate(req.body);    // Validate the data from request's body using schema

        // Send a response back may be containing any errors
        // But for a prod grade large app it is suitable to create a single place to handle and send these errors
        // Instead of handling it inside each of the API controller
        if(error) {
            // We can use error handling middleware with express which will catch these thrown errors
            // Issue with that is cant catch the errors thrown from async funcs, we will need to make this fn async
            // **Workaround/Soln**: we can call the next(error) and pass error and then err middleware can catch it.
            // throw error;
            return next(error);     // Need to create this special middleware to catch the errors.
        }
        // Validation Done

        // Check if the user exists already in DB
        try {
            const exist = await User.exists({ email: req.body.email });
            if(exist) {
                // Custom error handler
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        } catch(err) {
            return next(err)
        }

        // Parse the fields received from body
        const { name, email, password } = req.body;

        // Hash password -> bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the user entry for collection
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user inside the collection
        let access_token;
        try {
            const result = await user.save();

            // Return JWT token to client
            // Create JWT token first -> lib used jsonwebtoken
            // Separate JWT related things like token signing, verification etc into a separate service
            // Decision based on 'Single Responsibility Principle' this func should only contain logic for register
            // Token based logic should be thus separate and then imported and used here
            // In Payload we want to keep an obj with user's id, role as we want to check some things in future.
            access_token = JwtService.sign({ _id: result._id, role: result.role });       // let, const are block level access only

        } catch(err) {
            return next(err);
        }

        res.json({ access_token: access_token });
    }
}

export default registerController;