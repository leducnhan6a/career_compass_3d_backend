'use strict';

import { unGetSelectData } from '../../utils/selectDataOptions.js';
import Object3DModel from '../../models/3DObject.model.js';
import { convertToObjectIdMongoDB } from '../../utils/convertToObjectIdMongoDB.js';
import { BadRequestError, NotFoundError } from '../../core/error.response.js';

const findAll3DModels = async ({ unselect, sortBy }) => {
    return await Object3DModel.find().sort(sortBy).select(unGetSelectData(unselect));
};

const findAllDeleted3DModels = async ({ unselect, sortBy }) => {
    return await Object3DModel.findDeleted().sort(sortBy).select(unGetSelectData(unselect)).lean();
};

const findModelById = async (modelId) => await Object3DModel.findOne(convertToObjectIdMongoDB(modelId)).lean();

const findModelAndUpdateById = async ({ modelId, updateSet }) => {
    const foundModel = await findModelById(modelId);
    if (!foundModel) throw new NotFoundError('Model not found');
    const updatedModel = await Object3DModel.findByIdAndUpdate(modelId, updateSet, {
        upsert: true,
        new: true,
    });
    if (!updatedModel) throw new BadRequestError('Update fail');
    return updatedModel;
};

const findModelAndSoftDeleteById = async (modelId) => {
    const foundModel = await findModelById(modelId);
    if (!foundModel) throw new NotFoundError('Model not found');
    const deletedModel = await Object3DModel.delete({ _id: convertToObjectIdMongoDB(modelId) });
    if (!deletedModel) throw new NotFoundError('Model cannot be deleted');
    return deletedModel;
};

const findModelAndForceDeleteById = async (modelId) => await Object3DModel.findByIdAndDelete(modelId);

const findModelAndRestoreById = async (modelId) => {
    const foundModel = await Object3DModel.findDeleted(convertToObjectIdMongoDB(modelId));
    if (!foundModel) throw new NotFoundError('Model not found');
    const restoredModel = await Object3DModel.restore({ _id: convertToObjectIdMongoDB(modelId) });
    if (!restoredModel) throw new NotFoundError('Model cannot be deleted');
    return restoredModel;
};

export {
    findModelAndRestoreById,
    findAllDeleted3DModels,
    findAll3DModels,
    findModelById,
    findModelAndUpdateById,
    findModelAndSoftDeleteById,
    findModelAndForceDeleteById,
};
