'use strict';

import { BadRequestError, NotFoundError } from '../core/error.response.js';
import { convertToObjectIdMongoDB } from '../utils/convertToObjectIdMongoDB.js';
import Object3DModel from '../models/3DObject.model.js';
import userModel from '../models/user.model.js';
import SupabaseService from './supabase.service.js';
import {
    findAll3DModels,
    findModelById,
    findModelAndUpdateById,
    findModelAndSoftDeleteById,
    findModelAndRestoreById,
    findAllDeleted3DModels,
    findModelAndForceDeleteById,
} from './repositories/model.service.js';

class SurveyService {
    // Lấy các model chưa xóa (non - deleted) [user / admin]
    static async getAll3DModels({ query: { sort = 'ctime', unselect = ['deleted'] } }) {
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };

        const models = await findAll3DModels({ unselect, sortBy });
        if (!models) throw new NotFoundError('Not found any non - deleted model');
        return models;
    }

    // [admin]
    static async getAllDeleted3DModels({ query: { sort = 'ctime', unselect = ['deleted'] } }) {
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };
        const models = await findAllDeleted3DModels({ unselect, sortBy });
        if (!models) throw new NotFoundError('Not found any deleted model');
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
        return await SupabaseService.getSignedURL(modelId);
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
}

export default SurveyService;
