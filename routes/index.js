import express from 'express';
// import registerController from '../controllers/auth/registerController'; (Introduced a index.js to make imports easy)
import { registerController, loginController, userController, refreshController, productController } from '../controllers';
import auth from '../middlewares/auth';

// Here we will use a new thing called express Router for defining routes
const router = express.Router();

// Since we store data on the server use POST method
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);             // Auth middleware to parse the header bearer token & pass it to userController to validate
router.post('/refresh', refreshController.refresh)
router.post('/logout', auth, loginController.logout);

router.post('/products', productController.store);

export default router;