'use strict'

import HollandGroupModel from "../../models/hollandGroup.model.js";
import HollandQuestionModel from '../../models/hollandQuestion.model.js'

// Tăng số totalQuestion
const increaseTotalQuestion = async (group) => {
    return await HollandGroupModel.updateOne({ holland_code: group }, { $inc: { holland_totalQuestions: 1 } });
}

// Giảm số totalQuestion
const decreaseTotalQuestion = async (group) => {
    return await HollandGroupModel.updateOne({ holland_code: group }, { $inc: { holland_totalQuestions: -1 } });
}

// Lấy tất cả group trong holland group
const getAllGroups = async () => {
    return await HollandGroupModel.find({});
}

// Tìm group với holland code (tên group)
const findGroupByGroupName = async (group) => { 
    return await HollandGroupModel.findOne({ holland_code: group }).lean();
}

// Tìm question với group
const getAllQuestionsByGroupName = async (groupName) => {
    return await HollandQuestionModel.find({ question_code: { $in: groupName } }).select('question_code question_text _id').lean();
}

// Tìm question với id
const findQuestionById = async (questionId) => {
    return await HollandQuestionModel.findById(questionId);
};

// Tạo question mới
const createQuestion = async (questionData) => {
    const newQuestion = new HollandQuestionModel(questionData);
    increaseTotalQuestion(questionData.question_code);
    return await newQuestion.save();
}

// Cập nhật lại question
const updateQuestionById = async (questionId, updateData) => {
    const currentQuestion = await findQuestionById(questionId);
    if (!currentQuestion) return null;

    const oldCode = currentQuestion.question_code;
    const newCode = updateData.question_code;

    // Nếu group code thay đổi thì cập nhật số lượng
    if (newCode && newCode !== oldCode) {
        await decreaseTotalQuestion(oldCode);
        await increaseTotalQuestion(newCode);
    }

    return await HollandQuestionModel.findByIdAndUpdate(
        questionId,
        { $set: updateData },
        { new: true }
    ).lean();
};

// Xoá mềm
const softDeleteQuestionById = async (questionId) => {
    const question = await findQuestionById(questionId);
    if (!question) return null;

    await question.delete();
    if (question?.question_code)
        // Giảm số lượng câu hỏi trong group tương ứng
        await decreaseTotalQuestion(question.question_code);

    return question.toObject();
};

// Khôi phục tin bị xoá mềm
const restoreQuestionById = async (questionId) => {
    const question = await HollandQuestionModel.findOneWithDeleted({ _id: questionId });
    if (!question) return null;

    await question.restore();
    if (question?.question_code) {
        // Tăng lại số lượng câu hỏi trong group tương ứng
        await increaseTotalQuestion(question.question_code);
    }

    return question.toObject();
};

// Xoá vĩnh viễn
const deleteQuestionById = async (questionId) => {
    const question = await findQuestionById(questionId);
    if (!question) return null;

    if (question?.question_code)
        // Giảm số lượng câu hỏi trong group tương ứng
        await decreaseTotalQuestion(question.question_code);

    return await HollandQuestionModel.findByIdAndDelete(questionId).lean();
};

export { 
    getAllGroups,
    findQuestionById,
    createQuestion,
    updateQuestionById,
    softDeleteQuestionById,
    restoreQuestionById,
    deleteQuestionById,
    findGroupByGroupName,
    getAllQuestionsByGroupName,
    increaseTotalQuestion,
    decreaseTotalQuestion }