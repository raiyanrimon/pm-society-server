import express from 'express';
import { authController } from './controller.auth';
import { authenticateJWT } from '../../middlewares/auth';



const router = express.Router();
router.post('/login', authController.loginUser);
router.post('/logout', async (req, res, next) => {
  try {
	await authController.logoutUser(req, res);
  } catch (error) {
	next(error);
  }
});
router.get("/me", authenticateJWT, authController.getMe);
router.post("/change-password", authenticateJWT, authController.changePassword);

export const AuthRoutes = router;