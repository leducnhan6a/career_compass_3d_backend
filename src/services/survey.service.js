'use strict';

import HollandQuestionModel from '../models/hollandQuestion.model.js';
import HollandGroupModel from '../models/hollandGroup.model.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import { findGroupByGroupName, getAllQuestionsByGroupName } from './repositories/survey.service.js';
import userModel from '../models/user.model.js';
import { findHistoryResultByUserId } from './repositories/user.service.js';

const fakeUserId = '67ff30e04be458b1d0248c86';

class SurveyService {
    // Lấy các câu hỏi cùng nhóm
    async getQuestionsByGroup({ groupName }) {
        const questionsGroup = await getAllQuestionsByGroupName(groupName);
        if (!questionsGroup) throw new NotFoundError('Group not found');

        return questionsGroup;
        // return await HollandQuestionModel.find({
        //     question_type: group._id,
        //     is_deleted: { $ne: true },
        // }).lean();
    }

    // Tạo câu hỏi mới
    async createQuestion({ group, question }) {
        const foundGroup = await findGroupByGroupName(group);
        if (!foundGroup) throw new NotFoundError('Group not found');

        const newQuestion = await HollandQuestionModel.create({
            question_code: group,
            question_text: question,
            // question_options: options
        });

        if (!newQuestion) throw new BadRequestError('Cannot create new question');
        return newQuestion;
    }

    async solveSurveyResult({userId = fakeUserId, scoreByGroup}) {
        if (!scoreByGroup || typeof scoreByGroup !== 'object') throw new BadRequestError('Invalid score data');

        const sortedScore = Object.entries(scoreByGroup).sort((a, b) => b[1] - a[1]);
        const top3Score = sortedScore.slice(0, 3).map(([group, score]) => ({
            group,
            score,
            percentage: Math.round((score / 10) * 100),
        }));

        const newHistory = {
            hollandCode: top3Score.map((item) => item.group[0]).join(''),
            scoreByGroup,
            top3Trends: top3Score,
            createdAt: new Date(),
        };

        const newUpdate = await userModel.findByIdAndUpdate(userId, {
            $push: {
                user_history: {
                    action: "survey_result",
                    metadata: newHistory
                }
            },
        });

        if (!newUpdate) throw new BadRequestError('update history error');
        return top3Score;
    }

    async getAllHistoryResult(userId = fakeUserId) { 
        const foundHistoryResults = await findHistoryResultByUserId(userId);
        return foundHistoryResults
    }

    // Cập nhật lại nội dung câu hỏi
    // Để 1 nút Edit bên cạnh câu hỏi nên sẽ tự truy xuất id của nó, ko cần try catch
    async updateQuestion(questionId, updateData) {
        return await HollandQuestionModel.findByIdAndUpdate(questionId, { $set: updateData }, { new: true });
    }

    // Xoá mềm, tương tự như cập nhật lại nội dung câu hỏi
    async softDeleteQuestion(questionId) {
        return await HollandQuestionModel.findByIdAndUpdate(questionId, { $set: { is_deleted: true } }, { new: true });
    }

    // Xoá cứng, tương tự như trên
    async deleteQuestion(questionId) {
        return await HollandQuestionModel.findByIdAndDelete(questionId);
    }
}

export default new SurveyService();
