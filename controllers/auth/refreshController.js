import Joi from 'joi'
import { RefreshToken } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from '../../config';

const refreshController = {
    async refresh(req, res, next) {
        // Validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // database check
        // If token not present (revoked or logout)
        let refreshToken;
        try {
            refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if(!refreshToken) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            // Verify the token
            let userId;
            try {
                const { _id } = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
            } catch(err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const user = await User.findOne({ _id: userId });
            if(!user) {
                return next(CustomErrorHandler.unAuthorized('No user found!'));
            }

            // tokens
             // Acces Token
             const access_token = JwtService.sign({_id: user._id, role: user.role });
             // Generate refresh token
             const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
             // Database whitelist
             await RefreshToken.create({ token: refresh_token });
 
             // { key: value} same -> {key}
             res.json({ access_token, refresh_token });
        } catch (err) {
            return next(new Error('Something went wrong! ' + err.message));
        }
    }
};

export default refreshController;