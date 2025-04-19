'use strict';

import { Buffer } from 'buffer';

import { findHistoryResultByUserId } from './repositories/user.service.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import Object3DModel from '../models/3DObject.model.js';
import userModel from '../models/user.model.js';
import { convertToObjectIdMongoDB } from '../utils/convertToObjectIdMongoDB.js';
import SupabaseService from './supabase.service.js';
import {
    findAll3DModels,
    findModelById,
    findModelAndUpdateById,
    findModelAndSoftDeleteById,
    findModelAndRestoreById,
    findAllDeleted3DModels,
    findModelAndForceDeleteById
} from './repositories/model.service.js';

class SurveyService {
    // Lấy các model chưa xóa (non - deleted) [user / admin]
    static async getAll3DModels({ query: { limit = 50, sort = 'ctime', filter, unselect = ['deleted'], page = 1 } }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };

        const models = await findAll3DModels({ limit, sortBy, filter, skip, unselect, page });
        if (!models) throw new NotFoundError('Not found any model');
        return models;
    }

    // [admin]
    static async getAllDeleted3DModels({
        query: { limit = 50, sort = 'ctime', filter, unselect = ['deleted'], page = 1 },
    }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };

        const models = await findAllDeleted3DModels({ limit, sortBy, filter, skip, unselect, page });
        if (!models) throw new NotFoundError('Not found any model');
        return models;
    }

    // [user / admin]
    static async getModelDetailById({ params: { modelId } }) {
        const foundModel = await findModelById(modelId);
        if (!foundModel) throw new NotFoundError('3D Model Not Found');
        return foundModel;
    }

    // [admin]
    static async updateModelDetailById({ params: { modelId }, body: updateSet }) {
        const foundModel = await findModelAndUpdateById({ modelId, updateSet });
        if (!foundModel) throw new NotFoundError('3D Model Not Found');
        return foundModel;
    }

    // [admin]
    static async softDeleteModelById({ params: { modelId } }) {
        const softDeleteModel = await findModelAndSoftDeleteById(modelId);
        return softDeleteModel;
    }

    // [admin]
    static async forceDeleteModelById({ params: { modelId } }) {
        const forceDeleteModel = await findModelAndForceDeleteById(modelId);
        return forceDeleteModel;
    }

    // [admin]
    static async restoreModelById({ params: { modelId } }) {
        const restoreModel = await findModelAndRestoreById(modelId);
        return restoreModel;
    }

    // [user]
    static async getSignedURLById({ params: { modelId } }) {
        return await SupabaseService.getSignedURL(modelId)
    }

    // Tạo câu hỏi mới
    static async upload3DFile(req) {
        // const {
        //     body: { name, description, thumbnailUrl },
        // } = req;
        // const file = req.file
        // const { userId } = req.user;
        const userId = '67ff30e04be458b1d0248c86';
        // const { filename, contentType } = req.body;
        // if (!filename || !contentType) throw new BadRequestError('Required body!');
        // if (!file) throw new NotFoundError('No file uploaded')

        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new NotFoundError('User not found');

        // file path trong supabase
        // const supabaseFilePath = `uploads/${Date.now()}_${filename}.glb`;
        // const createdFile = await SupabaseService.upload3DFileV2(file);
        const signedURL = await SupabaseService.getSignedURL({ contentType: 'model/gltf-binary' });

        // const responseUpload = await fetch(uploadUrl, {
        //     method: 'PUT',
        //     headers: {
        //       'Content-Type': file.type,
        //     },
        //     body: file,
        //   });
        // { url: signedUrlData, path: supabaseFilePath }
        return signedURL;
    }

    static async getInfoByModelId({ params: { modelId }, query: { unselect } }) {
        const found3DModel = await Object3DModel.findOne({ _id: convertToObjectIdMongoDB(modelId), isDeleted: false })
            .select(unGetSelectData(unselect))
            .lean();
        if (!found3DModel) throw new NotFoundError('Model not found');
        return found3DModel;
    }

    static async get3DBufferFile(req, res) {
        const {
            params: { modelId },
        } = req;
        // Kiểm tra cache trước
        // if (glbCache[modelId]) {
        //     res.setHeader('Content-Type', 'model/gltf-binary');
        //     res.send(glbCache[modelId]);
        // }

        const found3DModel = await Object3DModel.findOne({
            _id: convertToObjectIdMongoDB(modelId),
            deleted: false,
        }).lean(); // object)bin

        if (!found3DModel) {
            throw new NotFoundError('Model URL not found');
        }

        const bufferFile = found3DModel.object3d_bin;

        return bufferFile;

        // // console.log('modelUrl', found3DModel.object3d_modelUrl)
        // const response = await fetch(found3DModel.object3d_modelUrl);
        // console.log(response)
        // if (!response.ok) {
        //     throw new BadRequestError('Model file fetch failed from storage')
        // }

        // const arrayBuffer = await response.arrayBuffer();
        // const buffer = Buffer.from(arrayBuffer);

        // res.setHeader('Content-Type', 'model/gltf-binary');
        // return res.send(buffer); // frontend res.send(arrayByffer)
    }

    // static async solveSurveyResult({ body: { userId = fakeUserId, answers } }) {
    //     if (!Array.isArray(answers) || answers.length === 0) throw new BadRequestError('Invalid answer data');

    //     const scoreMap = {};
    //     let totalScore = 0;

    //     for (const { group, value } of answers) {
    //         if (!group || typeof value !== 'number') throw new BadRequestError('Invalid answer format');
    //         scoreMap[group] = (scoreMap[group] || 0) + value;
    //         totalScore += value;
    //     }

    //     const groups = await HollandGroupModel.find({});
    //     const totalQuestions = groups.reduce((sum, group) => sum + group.holland_totalQuestions, 0);
    //     const maxScore = totalQuestions * 5;

    //     const groupScores = groups.reduce((acc, { holland_code, holland_totalQuestions }) => {
    //         const score = scoreMap[holland_code] || 0;
    //         const maxGroupScore = holland_totalQuestions * 5;
    //         acc[holland_code] = {
    //             groupScore: score,
    //             percentage: maxGroupScore ? Math.round((score / maxGroupScore) * 100) : 0,
    //         };
    //         return acc;
    //     }, {});

    //     const top3Traits = Object.entries(groupScores)
    //         .filter(([, data]) => data.groupScore > 0)
    //         .sort((a, b) => b[1].groupScore - a[1].groupScore)
    //         .slice(0, 3)
    //         .map(([group, data]) => ({ group, score: data.groupScore, percentage: data.percentage }));

    //     const hollandCode = top3Traits.map((t) => t.group).join('');
    //     const createdAt = new Date();

    //     const history = { hollandCode, groupScores, top3Traits, totalScore, maxScore, totalQuestions, createdAt };

    //     const updated = await userModel.findByIdAndUpdate(userId, {
    //         $push: { user_history: { action: 'survey_result', metadata: history } },
    //     });

    //     if (!updated) throw new BadRequestError('Update history error');

    //     return history;
    // }

    // // Truy xuất lịch sử người dùng
    // static async getAllHistoryResult({ body }) {
    //     return await findHistoryResultByUserId(body.userId);
    // }

    // // Cập nhật lại nội dung câu hỏi
    // static async updateQuestion({ params: { questionId }, body: updateData }) {
    //     const updated = await updateQuestionById(questionId, updateData);
    //     if (!updated) throw new BadRequestError('Cannot update question');
    //     return updated;
    // }

    // // Xoá mềm, tương tự như cập nhật lại nội dung câu hỏi
    // static async softDeleteQuestion({ params }) {
    //     const { questionId } = params;
    //     const question = await findQuestionById(questionId);

    //     const deleted = await softDeleteQuestionById(questionId);

    //     if (!deleted) throw new BadRequestError('Cannot soft delete question');

    //     if (question?.question_code) {
    //         await HollandGroupModel.updateOne({ group_code: question.question_code }, { $inc: { totalQuestions: -1 } });
    //     }

    //     return deleted;
    // }

    // // Khôi phục câu hỏi đã bị xóa mềm
    // static async restoreQuestion({ params: { questionId } }) {
    //     const restored = await restoreQuestionById(questionId);
    //     if (!restored) throw new BadRequestError('Cannot restore question');

    //     if (restored?.question_code) {
    //         // Tăng lại số lượng câu hỏi trong group tương ứng
    //         await HollandGroupModel.updateOne({ group_code: restored.question_code }, { $inc: { totalQuestions: 1 } });
    //     }

    //     return restored;
    // }

    // // Xoá cứng, tương tự như trên
    // static async deleteQuestion({ params: { questionId } }) {
    //     const question = await findQuestionById(questionId);
    //     const removed = await deleteQuestionById(questionId);

    //     if (!removed) throw new BadRequestError('Cannot delete question');

    //     if (question?.question_code) {
    //         await HollandGroupModel.updateOne({ group_code: question.question_code }, { $inc: { totalQuestions: -1 } });
    //     }

    //     return removed;
    // }
}

export default SurveyService;
