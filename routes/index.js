import express from 'express';
// import registerController from '../controllers/auth/registerController'; (Introduced a index.js to make imports easy)
import { registerController } from '../controllers';

// Here we will use a new thing called express Router for defining routes
const router = express.Router();

// Since we store data on the server use POST method
router.post('/register', registerController.register);

export default router;