import express from 'express';
// import registerController from '../controllers/auth/registerController'; (Introduced a index.js to make imports easy)
import { registerController, loginController, userController, refreshController, productController } from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

// Here we will use a new thing called express Router for defining routes
const router = express.Router();

// Since we store data on the server use POST method
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);             // Auth middleware to parse the header bearer token & pass it to userController to validate
router.post('/refresh', refreshController.refresh)
router.post('/logout', auth, loginController.logout);

router.post('/products', [auth, admin], productController.store);
router.put('/products/:id', [auth, admin], productController.update);
router.delete('/products/:id', [auth, admin], productController.destroy);
router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/products/cart-items', productController.getProducts);

export default router;