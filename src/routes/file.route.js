import express from 'express';
import {authenticator} from '../middleware/authentication.js';
import {authorization} from '../middleware/authorization.js';
import {upload} from '../utils/multer.js'
import {newFile,  getFileShareLink, getUsersFiles, openFile, deleteFile, deleteUserFiles} from '../controllers/file.controller.js'

const router = express.Router();

router.post('/new-file', authenticator, authorization('user'), upload.single("file"), newFile);
router.get('/link/file/:id', authenticator, getFileShareLink);
router.get('/user/file', authenticator, getUsersFiles);
router.get('/file/:shareId', authenticator, openFile);
router.delete('/file/:id', authenticator, deleteFile);
router.delete('/user/file', authenticator, deleteUserFiles);

export default router;