'use strict';

import express from 'express';
import SurveyController from '../controllers/survey.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { apiKey, permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission('0000'));

// authentication
router.use(authenticationV2);

// get questions by group
router.get('/questions', asyncHandler(SurveyController.getQuestionsByGroup));

// create new question
router.post('/questions', asyncHandler(SurveyController.createQuestion));

// update question
router.put('/questions/:questionId', asyncHandler(SurveyController.updateQuestion));

// soft delete question
router.patch('/questions/:questionId/delete', asyncHandler(SurveyController.softDeleteQuestion));

// permanent delete question
router.delete('/questions/:questionId', asyncHandler(SurveyController.deleteQuestion));

export default router;