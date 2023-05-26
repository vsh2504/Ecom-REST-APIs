import { JWT_SECRET } from "../config";
import jwt from 'jsonwebtoken';

class JwtService {
    static sign(payload, expiry = '60s', secret = JWT_SECRET) {
        // Add some data after encrypting it
        // Then when client sends this token to server this token is verified before proceeding
        // If someone alters it then it will become invalid
        // Params -> payload: what needs to be stored inside token, expiry: when token should be expired, secret key -> used to sign & verify token
        // Keep secret secure in .env file
        return jwt.sign(payload, secret, { expiresIn: expiry });
    }
}

export default JwtService;