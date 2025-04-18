'use strict';

import express from 'express';
import ModelController from '../controllers/model.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
// import { apiKey, permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';
import { permission } from '../middlewares/auth.middleware.js'

const router = express.Router();

// // check apiKey
// router.use(apiKey);

// // check permission

// authentication
router.use(authenticationV2);

router.get('', asyncHandler(ModelController.getAll3DModels));
router.get('/:modelId/info', asyncHandler(ModelController.getInfoByModelId));
router.get('/:modelId/model', asyncHandler(ModelController.get3DBufferFile));

// get questions by group
router.use(permission('admin'));

// create new question
router.post('', asyncHandler(ModelController.getSignedURLSupabase));

// post result data

// post result data

// // get all history result
// router.get('/history', asyncHandler(SurveyController.getAllHistoryResult));

// // update question
// router.put('/questions/:questionId', asyncHandler(SurveyController.updateQuestion));

// // soft delete question
// router.patch('/questions/:questionId/delete', asyncHandler(SurveyController.softDeleteQuestion));

// // restore deleted question
// router.patch('/questions/:questionId/restore', asyncHandler(SurveyController.restoreDeletedQuestion));

// // permanent delete question
// router.delete('/questions/:questionId', asyncHandler(SurveyController.deleteQuestion));

export default router;