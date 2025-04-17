'use strict';

import { findHistoryResultByUserId } from './repositories/user.service.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import Object3DModel from '../models/3DObject.model.js';
import { unGetSelectData, getSelectData } from '../utils/selectDataOptions.js';
import userModel from '../models/user.model.js';
import { convertToObjectIdMongoDB } from '../utils/convertToObjectIdMongoDB.js'

class SurveyService {
    // Lấy các câu hỏi cùng nhóm
    static async getAll3DModels({ query: { limit = 50, sort = 'ctime', filter, unselect, page = 1 } }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };

        const products = await Object3DModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(unGetSelectData(unselect))
            .lean();
        return products;
    }

    // Tạo câu hỏi mới
    static async createNew3DModel({ body: { name, description, thumbnailUrl, modelUrl } }) {
        const { userId } = req.user;
        const foundUser = await userModel.findById(userId).select('user_permission').lean();
        const new3DModelDetail = await Object3DModel.create({
            object3d_name: name,
            object3d_description: description,
            object3d_thumbnailUrl: thumbnailUrl,
            object3d_modelUrl: modelUrl,
            object3d_author: foundUser,
        });

        if (!new3DModelDetail) throw new BadRequestError('Can not create new 3D Model');

        return new3DModelDetail;
    }

    static async getInfoByModelId({ params: { modelId }, query: { unselect } }) {
        const found3DModel = await Object3DModel
            .findOne({ _id: convertToObjectIdMongoDB(modelId), isDeleted: false })
            .select(unGetSelectData(unselect))
            .lean();
        if (!found3DModel) throw new NotFoundError('Model not found');

        return found3DModel;
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
