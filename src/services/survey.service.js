'use strict';

import HollandQuestionModel from '../models/hollandQuestion.model.js';
import HollandGroupModel from '../models/hollandGroup.model.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import { findGroupByGroupName, getAllQuestionsByGroupName } from './repositories/survey.service.js';

class SurveyService {

    // Lấy các câu hỏi cùng nhóm
    async getQuestionsByGroup({ groupName }) {
        const questionsGroup = await getAllQuestionsByGroupName(groupName)
        if (!questionsGroup) throw new NotFoundError('Group not found');

        return questionsGroup
        // return await HollandQuestionModel.find({
        //     question_type: group._id,
        //     is_deleted: { $ne: true },
        // }).lean();
    }

    // Tạo câu hỏi mới
    async createQuestion({ group, question }) {
        const foundGroup = await findGroupByGroupName(group);
        if (!foundGroup) throw new NotFoundError('Group not found');

        const newQuestion =  await HollandQuestionModel.create({
            question_code: group,
            question_text: question,
            // question_options: options
        });

        if (!newQuestion) throw new BadRequestError("Cannot create new question")
        return newQuestion
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