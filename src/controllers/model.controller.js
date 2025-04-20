'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import ModelService from '../services/model.service.js';

class ModelController {
    async getAll3DModels(req, res) {
        const result = await ModelService.getAll3DModels(req);
        new SuccessResponse({
            message: 'Get all 3d models successfully!',
            metadata: result,
        }).send(res);
    }

    async getAllDeleted3DModels(req, res) {
        const result = await ModelService.getAllDeleted3DModels(req);
        new SuccessResponse({
            message: 'Get all 3d models successfully!',
            metadata: result,
        }).send(res);
    }

    async getModelDetailById(req, res) {
        const result = await ModelService.getModelDetailById(req);
        new SuccessResponse({
            message: 'Get detail of model use modelId successfully!',
            metadata: result,
        }).send(res);
    }

    async updateModelDetailById(req, res) {
        const result = await ModelService.updateModelDetailById(req);
        new SuccessResponse({
            message: 'Update detail of model use modelId successfully!',
            metadata: result,
        }).send(res);
    }

    async softDeleteModelById(req, res) {
        const result = await ModelService.softDeleteModelById(req);
        new SuccessResponse({
            message: 'Soft delete model use modelId successfully!',
            metadata: result,
        }).send(res);
    }

    async forceDeleteModelById(req, res) {
        const result = await ModelService.forceDeleteModelById(req);
        new SuccessResponse({
            message: 'Force delete model use modelId successfully!',
            metadata: result,
        }).send(res);
    }

    async restoreModelById(req, res) {
        const result = await ModelService.restoreModelById(req);
        new SuccessResponse({
            message: 'Restore deleted model use modelId successfully!',
            metadata: result,
        }).send(res);
    }

    async getSignedURLById(req, res) {
        const result = await ModelService.getSignedURLById(req);
        new SuccessResponse({
            message: 'Get signed URL of model use modelId successfully!',
            metadata: result,
        }).send(res);
    }
}

export default new ModelController();
