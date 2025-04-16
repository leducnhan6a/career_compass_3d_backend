'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import SurveyService from '../services/survey.service.js'

class SurveyController {
    async getQuestionsByGroup(req, res) {
        const result = await SurveyService.getQuestionsByGroup(req)
        new SuccessResponse({
            message: 'Grouped questions',
            metadata: result,
        }).send(res);
    }

    async solveSurveyResult(req, res) {
        const result = await SurveyService.solveSurveyResult(req);
        new SuccessResponse({
            message: 'Solve survey result successfully',
            metadata: result,
        }).send(res);
    }

    // Cập nhật cơ chế History trong tương lai
    async getAllHistoryResult(req, res) { 
        const result = await SurveyService.getAllHistoryResult(req)
        new SuccessResponse({
            message: 'Get user history result successfully',
            metadata: result,
        }).send(res);
    }

    async createQuestion(req, res) {
        const result = await SurveyService.createQuestion(req);
        new CREATED({
            message: 'Question created successfully',
            metadata: result,
        }).send(res);
    }

    async updateQuestion(req, res) {
        const result = await SurveyService.updateQuestion(req);
        new SuccessResponse({
            message: 'Question updated successfully',
            metadata: result,
        }).send(res);
    }

    async softDeleteQuestion(req, res) {
        const result = await SurveyService.softDeleteQuestion(req);
        new SuccessResponse({
            message: 'Question soft deleted',
            metadata: result,
        }).send(res);
    }

    async deleteQuestion(req, res) {
        const result = await SurveyService.deleteQuestion(req);
        new SuccessResponse({
            message: 'Question deleted',
            metadata: result,
        }).send(res);
    }
}

export default new SurveyController();