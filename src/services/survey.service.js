'use strict';

import userModel from '../models/user.model.js';
import HollandGroupModel from '../models/hollandGroup.model.js';
import HollandQuestionModel from '../models/hollandQuestion.model.js';
import { findHistoryResultByUserId } from './repositories/user.service.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import {
    findGroupByGroupName,
    getAllQuestionsByGroupName,
    updateQuestionById,
    softDeleteQuestionById,
    deleteQuestionById,
    findQuestionById,
} from './repositories/survey.service.js';

const fakeUserId = '67ff30e04be458b1d0248c86';

class SurveyService {
    // Lấy các câu hỏi cùng nhóm
    static async getQuestionsByGroup({ params: { groupName } }) {
        const questionsGroup = await getAllQuestionsByGroupName(groupName);
        if (!questionsGroup || questionsGroup.length === 0) throw new NotFoundError('Group not found');

        return questionsGroup;
    }

    // Tạo câu hỏi mới
    static async createQuestion({ body: { group, question } }) {
        const foundGroup = await findGroupByGroupName(group);
        if (!foundGroup) throw new NotFoundError('Group not found');

        const newQuestion = await HollandQuestionModel.create({
            question_code: group,
            question_text: question,
        });

        await HollandGroupModel.updateOne({ group_code: group }, { $inc: { totalQuestions: 1 } });

        if (!newQuestion) throw new BadRequestError('Cannot create new question');
        return newQuestion;
    }

    static async getAllHistoryResult({ body }) {
        return (foundHistoryResults = await findHistoryResultByUserId(body.userId));
    }

    // Cập nhật lại nội dung câu hỏi
    // Để 1 nút Edit bên cạnh câu hỏi nên sẽ tự truy xuất id của nó, ko cần try catch
    static async updateQuestion({ params: { questionId }, body: updateData }) {
        const updated = await updateQuestionById(questionId, updateData);
        if (!updated) throw new BadRequestError('Cannot update question');
        return updated;
    }

    // Xoá mềm, tương tự như cập nhật lại nội dung câu hỏi
    static async softDeleteQuestion({ params }) {
        const { questionId } = params
        const question = await findQuestionById(questionId);
        
        const deleted = await softDeleteQuestionById(questionId);
        console.log('question:: ', deleted)


        if (!deleted) throw new BadRequestError('Cannot soft delete question');

        if (question?.question_code) {
            await HollandGroupModel.updateOne({ group_code: question.question_code }, { $inc: { totalQuestions: -1 } });
        }

        return deleted;
    }

    // Xoá cứng, tương tự như trên
    static async deleteQuestion({ params: { questionId } }) {
        const question = await findQuestionById(questionId);
        const removed = await deleteQuestionById(questionId);

        if (!removed) throw new BadRequestError('Cannot delete question');

        if (question?.question_code) {
            await HollandGroupModel.updateOne({ group_code: question.question_code }, { $inc: { totalQuestions: -1 } });
        }

        return removed;
    }
}

export default SurveyService;
