'use strict'

import HollandGroupModel from "../../models/hollandGroup.model.js";
import HollandQuestionModel from '../../models/hollandQuestion.model.js'

// Tìm group với holland code (tên group)
const findGroupByGroupName = async (group) => { 
    return await HollandGroupModel.findOne({ holland_code: group }).lean();
}

// Tìm question với group
const getAllQuestionsByGroupName = async (groupName) => { 
    return await HollandQuestionModel.find({ question_code: groupName[0] }).lean();
}

// Tìm question với id
const findQuestionById = async (questionId) => {
    return await HollandQuestionModel.findById(questionId).lean();
};

// Cập nhật lại question
const updateQuestionById = async (questionId, updateData) => {
    return await HollandQuestionModel.findByIdAndUpdate(
        questionId,
        { $set: updateData },
        { new: true }
    ).lean();
};

// Xoá mềm
const softDeleteQuestionById = async (questionId) => {
    const question = await HollandQuestionModel.findById(questionId);
    if (!question) return null;
    await question.delete();
    return question.toObject();
};

// Khôi phục
const restoreQuestionById = async (questionId) => {
    const question = await HollandQuestionModel.findOneWithDeleted({ _id: questionId });
    if (!question) return null;
    await question.restore();
    return question.toObject();
};

// Xoá vĩnh viễn
const deleteQuestionById = async (questionId) => {
    return await HollandQuestionModel.findByIdAndDelete(questionId).lean();
};

export { findQuestionById, updateQuestionById, softDeleteQuestionById, restoreQuestionById, deleteQuestionById, findGroupByGroupName, getAllQuestionsByGroupName }