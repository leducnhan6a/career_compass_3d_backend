'use strict';

import { findHistoryResultByUserId, findUserAndUpdate } from './repositories/user.service.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import {
    restoreQuestionById,
    findGroupByGroupName,
    createQuestion,
    getAllQuestionsByGroupName,
    updateQuestionById,
    softDeleteQuestionById,
    deleteQuestionById,
    getAllGroups,
    getAllQuestions,
    findAllDeletedQuestions
} from './repositories/survey.service.js';

class SurveyService {
    // Lấy các câu hỏi sử dụng limit, skip
    static async getAllQuestions({ query: { limit = 10, sort = 'ctime', page = 1 } }) {
        const allQuestions = await getAllQuestions({ limit, sort, page });
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
        return shuffledQuestions;
    }

    // Lấy các câu hỏi cùng nhóm
    static async getQuestionsByGroup({ query: { groupName } }) {
        if (!groupName) throw new BadRequestError('Group name is required');

        const groupArray = Array.isArray(groupName) ? groupName : groupName.split('');

        const questionsGroup = await getAllQuestionsByGroupName(groupArray);
        if (!questionsGroup || questionsGroup.length === 0) throw new NotFoundError('Group(s) not found');

        return questionsGroup;
    }

    // Tạo câu hỏi mới
    static async createQuestion({ body: { group, question } }) {
        const foundGroup = await findGroupByGroupName(group);
        if (!foundGroup) throw new NotFoundError('Group not found');

        const newQuestion = await createQuestion({ question_code: group, question_text: question });
        if (!newQuestion) throw new BadRequestError('Cannot create new question');

        return newQuestion;
    }

    // Xử lý kết quả khảo sát
    static async solveSurveyResult({ body: { userId, answers } }) {
        if (!Array.isArray(answers) || answers.length === 0) throw new BadRequestError('Invalid answer data');

        const scoreMap = {};
        let totalScore = 0;

        for (const { group, value } of answers) {
            if (!group || typeof value !== 'number') throw new BadRequestError('Invalid answer format');
            scoreMap[group] = (scoreMap[group] || 0) + value;
            totalScore += value;
        }

        const groups = await getAllGroups();
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

        const updated = await findUserAndUpdate(userId, {
            $push: { user_history: { action: 'survey_result', metadata: history } },
        });
        if (!updated) throw new BadRequestError('Update history error');

        return history;
    }

    // Truy xuất lịch sử người dùng
    static async getAllHistoryResult({ query: { userId } }) {
        return await findHistoryResultByUserId(userId);
    }

    static async getTrashQuestions({ query: { sort = 'ctime' } }) {
        const unselect = ['deleted']
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };
        const deletedQuestions = await findAllDeletedQuestions({ unselect, sortBy });
        return deletedQuestions;
    }

    // Cập nhật lại nội dung câu hỏi
    static async updateQuestion({ params: { questionId }, body: updateData }) {
        const updated = await updateQuestionById(questionId, updateData);
        if (!updated) throw new BadRequestError('Cannot update question');

        return updated;
    }

    // Xoá mềm, tương tự như cập nhật lại nội dung câu hỏi
    static async softDeleteQuestion({ params: { questionId } }) {
        const deleted = await softDeleteQuestionById(questionId);
        if (!deleted) throw new BadRequestError('Cannot soft delete question');

        return deleted;
    }

    // Khôi phục câu hỏi đã bị xóa mềm
    static async restoreQuestion({ params: { questionId } }) {
        const restored = await restoreQuestionById(questionId);
        if (!restored) throw new BadRequestError('Cannot restore question');

        return restored;
    }

    // Xoá cứng, tương tự như trên
    static async deleteQuestion({ params: { questionId } }) {
        const removed = await deleteQuestionById(questionId);
        if (!removed) throw new BadRequestError('Cannot delete question');
        return removed;
    }
}

export default SurveyService;
