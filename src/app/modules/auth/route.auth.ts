import express from 'express';
import { authController } from './controller.auth';
import auth, { USER_ROLE } from '../../middlewares/auth';


const router = express.Router();
router.post('/login', authController.loginUser);
router.post('/logout', async (req, res, next) => {
  try {
	await authController.logoutUser(req, res);
  } catch (error) {
	next(error);
  }
});
router.post('/change-password',auth(USER_ROLE.admin, USER_ROLE.member), authController.changePassword);
router.get('/me',auth(USER_ROLE.admin, USER_ROLE.member), authController.getMe);


export const AuthRoutes = router;