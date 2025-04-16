'use strict';
import express from 'express';
import AccessController from '../controllers/access.controller.js';
import asyncHandler from '../helpers/asyncHandler.js'
import { apiKey, permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// check apiKey
// router.use(apiKey);

// check permission
// router.use(permission('0000'))

router.post('/signup', asyncHandler(AccessController.signup));
router.post('/login', asyncHandler(AccessController.login));

// authentication middleware
router.use(authenticationV2)


router.post('/logout', asyncHandler(AccessController.logout))
// router.post('/handleRefreshToken', asyncHandler(AccessController.handleRefreshToken))

export default router;