import express from 'express';
import {signUp, signIn, updateUser, fetchUserInfo, fetchAllUsers, deleteUser, AssigninOTP, verifyOTP} from '../controllers/user.controller.js'
import {authenticator} from '../middleware/authentication.js'
import {authorization} from '../middleware/authorization.js';
const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);

router.put('/update', authenticator, updateUser);

router.get('/user', authenticator, fetchUserInfo);

router.delete('/delete/user', authenticator, deleteUser);
router.delete('/delete/user/:id', authenticator, authorization('admin'), deleteUser);

router.get('/users', authenticator, authorization('admin'), fetchAllUsers);

router.post('/user/OTP', authenticator, verifyOTP);

router.post('/OTP/user', authenticator, AssigninOTP);

export default router;

