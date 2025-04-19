'use strict';

import express from 'express';
import MajorController from '../controllers/major.controller.js'
import asyncHandler from '../helpers/asyncHandler.js';
// import { apiKey, permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// // check apiKey
// router.use(apiKey);

// // check permission
// router.use(permission('0000'));

// authentication loged in
router.use(authenticationV2);

// get majors by uni_code
router.get('/unicode', asyncHandler(MajorController.getMajorsByUniCode));

// create new question
router.post('/create', asyncHandler(MajorController.createMajor));

// update question
router.put('/update/:majorId', asyncHandler(MajorController.updateMajor));

// soft delete major
router.patch('/sdel/:majorId', asyncHandler(MajorController.softDeleteMajor));

// restore deleted major
router.patch('/restore/:majorId', asyncHandler(MajorController.restoreMajor));

// permanent delete major
router.delete('/del/:majorId', asyncHandler(MajorController.deleteMajorPermanently));

// get majors include aptitude
router.get('/aptitude', asyncHandler(MajorController.getMajorsIncludeAptitude));

export default router;