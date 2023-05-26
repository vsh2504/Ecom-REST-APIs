import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userController = {
    async me(req, res, next) {
        // We need to check each request coming to this route
        // Whether it contains a valid token or not
        try {
            // This user will come from auth middleware which we created
            const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            res.json(user);
        } catch (err) {
            return next(err);
        }
    }
};

export default userController;