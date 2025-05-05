'use strict';

import express from 'express';
import MajorController from '../controllers/major.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';
const router = express.Router();

// authentication loged in
router.use(authenticationV2);

// -----------------------------------------------------------------------

// check user permission
router.use(permission('user'));

// get all majors
router.get('/all', asyncHandler(MajorController.getAllMajor));

// get majors by uni_code
router.get('/unicode', asyncHandler(MajorController.getMajorsByUniCode));

// get majors include aptitude
router.get('/aptitude', asyncHandler(MajorController.getMajorsIncludeAptitude));

// -----------------------------------------------------------------------

// check admin permission
router.use(permission('admin'));

// get majors by uni_code
router.get('/trash', asyncHandler(MajorController.getTrashMajors));

// create new major
router.post('/create', asyncHandler(MajorController.createMajor));

// update major
router.put('/update/:majorId', asyncHandler(MajorController.updateMajor));

// soft delete major
router.patch('/:majorId/delete', asyncHandler(MajorController.softDeleteMajor));

// restore deleted major
router.patch('/:majorId/restore', asyncHandler(MajorController.restoreMajor));

// permanent delete major
router.delete('/:majorId/delete', asyncHandler(MajorController.deleteMajorPermanently));

export default router;
