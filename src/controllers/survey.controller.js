'use strict';

import SurveyService from '../services/survey.service.js';
import { CREATED, SuccessResponse } from '../core/success.response.js';

class SurveyController {
    async getQuestionsByGroup(req, res) {
        const result = await SurveyService.getQuestionsByGroup(req.query);
        new SuccessResponse({
            message: 'Get questions by group name successfully!',
            metadata: result,
        }).send(res);
    }

    async solveSurveyResult(req, res) {
        const result = await SurveyService.solveSurveyResult(req.body);
        new SuccessResponse({
            message: 'Solve survey result successfully',
            metadata: result,
        }).send(res);
    }

    async getAllHistoryResult(req, res) { 
        const result = await SurveyService.getAllHistoryResult()
        new SuccessResponse({
            message: 'Get user history result successfully',
            metadata: result,
        }).send(res);
    }

    async createQuestion(req, res) {
        const result = await SurveyService.createQuestion(req.body);
        new CREATED({
            message: 'Question created successfully',
            metadata: result,
        }).send(res);
    }

    async updateQuestion(req, res) {
        const result = await SurveyService.updateQuestion(req.params.questionId, req.body);
        new SuccessResponse({
            message: 'Question updated successfully',
            metadata: result,
        }).send(res);
    }

    async softDeleteQuestion(req, res) {
        const result = await SurveyService.softDeleteQuestion(req.params.questionId);
        new SuccessResponse({
            message: 'Question soft deleted',
            metadata: result,
        }).send(res);
    }

    async deleteQuestion(req, res) {
        const result = await SurveyService.deleteQuestion(req.params.questionId);
        new SuccessResponse({
            message: 'Question deleted',
            metadata: result,
        }).send(res);
    }
}

export default new SurveyController();