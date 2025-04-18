'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import SurveyService from '../services/survey.service.js'

class SurveyController {

    // Lấy câu hỏi theo nhóm
    async getQuestionsByGroup(req, res) {
        const result = await SurveyService.getQuestionsByGroup(req)
        new SuccessResponse({
            message: 'Get questions by group name successfully!',
            metadata: result,
        }).send(res);
    }

    // Xử lý kết quả khảo sát
    async solveSurveyResult(req, res) {
        const result = await SurveyService.solveSurveyResult(req);
        new SuccessResponse({
            message: 'Solve survey result successfully',
            metadata: result,
        }).send(res);
    }

    // Lấy dữ liệu lịch sử ng dùng
    async getAllHistoryResult(req, res) { 
        const result = await SurveyService.getAllHistoryResult(req)
        new SuccessResponse({
            message: 'Get user history result successfully',
            metadata: result,
        }).send(res);
    }

    // Tạo mới câu hỏi
    async createQuestion(req, res) {
        const result = await SurveyService.createQuestion(req);
        new CREATED({
            message: 'Question created successfully',
            metadata: result,
        }).send(res);
    }

    // Cập nhật câu hỏi
    async updateQuestion(req, res) {
        const result = await SurveyService.updateQuestion(req);
        new SuccessResponse({
            message: 'Question updated successfully',
            metadata: result,
        }).send(res);
    }

    // Xoá mềm câu hỏi có sẵn
    async softDeleteQuestion(req, res) {
        const result = await SurveyService.softDeleteQuestion(req);
        new SuccessResponse({
            message: 'Question soft deleted',
            metadata: result,
        }).send(res);
    }

    // Khôi phục câu hỏi bị xoá mềm
    async restoreDeletedQuestion(req, res) {
        const result = await SurveyService.restoreQuestion(req);
        new SuccessResponse({
            message: 'Question restored',
            metadata: result,
        }).send(res);
    }

    // Xoá vĩnh viễn câu hỏi
    async deleteQuestionPermanently(req, res) {
        const result = await SurveyService.deleteQuestion(req);
        new SuccessResponse({
            message: 'Question deleted',
            metadata: result,
        }).send(res);
    }
}

export default new SurveyController();