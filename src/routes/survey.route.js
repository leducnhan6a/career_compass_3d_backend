'use strict';

import express from 'express';
import SurveyController from '../controllers/survey.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// authentication
router.use(authenticationV2);

// Lấy các câu hỏi cùng phân loại
router.get('/questions', asyncHandler(SurveyController.getQuestionsByGroup));

// Tạo mới một câu hỏi
router.post('/questions', asyncHandler(SurveyController.createQuestion));

// Xử lý kết quả khảo sát
router.post('/result', asyncHandler(SurveyController.solveSurveyResult));

// Lấy dữ liệu lịch sử người dùng
router.get('/history', asyncHandler(SurveyController.getAllHistoryResult));

// Cập nhật lại câu hỏi có sẵn
router.put('/questions/:questionId', asyncHandler(SurveyController.updateQuestion));

// Xoá mềm câu hỏi có sẵn
router.patch('/questions/:questionId/delete', asyncHandler(SurveyController.softDeleteQuestion));

// Khôi phục lại câu hỏi bị xoá mềm
router.patch('/questions/:questionId/restore', asyncHandler(SurveyController.restoreDeletedQuestion));

// Xoá vĩnh viễn một câu hỏi
router.delete('/questions/:questionId', asyncHandler(SurveyController.deleteQuestionPermanently));

export default router;
