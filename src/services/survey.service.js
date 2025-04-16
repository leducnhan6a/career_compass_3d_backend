'use strict';

import HollandQuestionModel from '../models/hollandQuestions.model.js';
import HollandGroupModel from '../models/hollandGroup.model.js';
import { NotFoundError } from '../core/error.response.js';

class SurveyService {

    // Lấy các câu hỏi cùng nhóm
    async getQuestionsByGroup(groupName) {
        const group = await HollandGroupModel.findOne({ holland_full_code: groupName });
        if (!group) throw new NotFoundError('Group not found');

        return await HollandQuestionModel.find({
            question_type: group._id,
            is_deleted: { $ne: true },
        }).lean();
    }

    // Tạo câu hỏi mới
    async createQuestion({ group, question }) {
        const groupDoc = await HollandGroupModel.findOne({ holland_full_code: group });
        if (!groupDoc) throw new NotFoundError('Group not found');

        return await HollandQuestionModel.create({
            question_text: question,
            question_type: groupDoc._id,
        });
    }

    // Cập nhật lại nội dung câu hỏi
    // Để 1 nút Edit bên cạnh câu hỏi nên sẽ tự truy xuất id của nó, ko cần try catch
    async updateQuestion(questionId, updateData) {
        return await HollandQuestionModel.findByIdAndUpdate(
            questionId,
            { $set: updateData },
            { new: true }
        );
    }

    // Xoá mềm, tương tự như cập nhật lại nội dung câu hỏi
    async softDeleteQuestion(questionId) {
        return await HollandQuestionModel.findByIdAndUpdate(
            questionId,
            { $set: { is_deleted: true } },
            { new: true }
        );
    }

    // Xoá cứng, tương tự như trên
    async deleteQuestion(questionId) {
        return await HollandQuestionModel.findByIdAndDelete(questionId);
    }
}

export default new SurveyService();