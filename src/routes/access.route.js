'use strict';
import express from 'express';
import AccessController from '../controllers/access.controller.js';
import asyncHandler from '../helpers/asyncHandler.js'
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// signup
router.post('/signup', asyncHandler(AccessController.signup));

// login
router.post('/login', asyncHandler(AccessController.login));

// authentication middleware
router.use(authenticationV2)

router.post('/logout', asyncHandler(AccessController.logout))

export default router;