'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import ModelService from '../services/model.service.js'

class ModelController {
    async getAll3DModels(req, res) {
        const result = await ModelService.getAll3DModels(req)
        new SuccessResponse({
            message: 'Get all 3d models successfully!',
            metadata: result,
        }).send(res);
    }

    async createNew3DModel(req, res) {
        const result = await ModelService.createNew3DModel(req)
        new CREATED({
            message: 'Create new 3D Model successfully!',
            metadata: result,
        }).send(res);
    }

    async getInfoByModelId(req, res) {
        const result = await ModelService.getInfoByModelId(req)
        new SuccessResponse({
            message: 'Get detail of model use modelId successfully!',
            metadata: result,
        }).send(res);
    }


}

export default new ModelController();