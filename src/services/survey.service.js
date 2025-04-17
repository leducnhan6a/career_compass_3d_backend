'use strict';

import userModel from '../models/user.model.js';
import HollandGroupModel from '../models/hollandGroup.model.js';
import HollandQuestionModel from '../models/hollandQuestion.model.js';
import { findHistoryResultByUserId } from './repositories/user.service.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import {
    restoreQuestionById,
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
    static async getQuestionsByGroup({ query: { groupName } }) {
        const groupArray = Array.isArray(groupName) ? groupName : [groupName];
        const questionsGroup = await getAllQuestionsByGroupName(groupArray);
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

        await HollandGroupModel.updateOne({ holland_code: group }, { $inc: { holland_totalQuestions: 1 } });
        if (!newQuestion) throw new BadRequestError('Cannot create new question');
        return newQuestion;
    }

    static async solveSurveyResult({ body: { userId = fakeUserId, answers } }) {
        if (!Array.isArray(answers) || answers.length === 0) throw new BadRequestError('Invalid answer data');

        const scoreMap = {};
        let totalScore = 0;

        for (const { group, value } of answers) {
            if (!group || typeof value !== 'number') throw new BadRequestError('Invalid answer format');
            scoreMap[group] = (scoreMap[group] || 0) + value;
            totalScore += value;
        }

        const groups = await HollandGroupModel.find({});
        const totalQuestions = groups.reduce((sum, group) => sum + group.holland_totalQuestions, 0);
        const maxScore = totalQuestions * 5;

        const groupScores = groups.reduce((acc, { holland_code, holland_totalQuestions }) => {
            const score = scoreMap[holland_code] || 0;
            const maxGroupScore = holland_totalQuestions * 5;
            acc[holland_code] = {
                groupScore: score,
                percentage: maxGroupScore ? Math.round((score / maxGroupScore) * 100) : 0,
            };
            return acc;
        }, {});

        const top3Traits = Object.entries(groupScores)
            .filter(([, data]) => data.groupScore > 0)
            .sort((a, b) => b[1].groupScore - a[1].groupScore)
            .slice(0, 3)
            .map(([group, data]) => ({ group, score: data.groupScore, percentage: data.percentage }));

        const hollandCode = top3Traits.map((t) => t.group).join('');
        const createdAt = new Date();

        const history = { hollandCode, groupScores, top3Traits, totalScore, maxScore, totalQuestions, createdAt };

        const updated = await userModel.findByIdAndUpdate(userId, {
            $push: { user_history: { action: 'survey_result', metadata: history } },
        });

        if (!updated) throw new BadRequestError('Update history error');

        return history;
    }

    // Truy xuất lịch sử người dùng
    static async getAllHistoryResult({ body }) {
        return await findHistoryResultByUserId(body.userId);
    }

    // Cập nhật lại nội dung câu hỏi
    static async updateQuestion({ params: { questionId }, body: updateData }) {
        const updated = await updateQuestionById(questionId, updateData);
        if (!updated) throw new BadRequestError('Cannot update question');
        return updated;
    }

    // Xoá mềm, tương tự như cập nhật lại nội dung câu hỏi
    static async softDeleteQuestion({ params }) {
        const { questionId } = params;
        const question = await findQuestionById(questionId);

        const deleted = await softDeleteQuestionById(questionId);

        if (!deleted) throw new BadRequestError('Cannot soft delete question');

        if (question?.question_code) {
            await HollandGroupModel.updateOne({ group_code: question.question_code }, { $inc: { totalQuestions: -1 } });
        }

        return deleted;
    }

    // Khôi phục câu hỏi đã bị xóa mềm
    static async restoreQuestion({ params: { questionId } }) {
        const restored = await restoreQuestionById(questionId);
        if (!restored) throw new BadRequestError('Cannot restore question');

        if (restored?.question_code) {
            // Tăng lại số lượng câu hỏi trong group tương ứng
            await HollandGroupModel.updateOne({ group_code: restored.question_code }, { $inc: { totalQuestions: 1 } });
        }

        return restored;
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
