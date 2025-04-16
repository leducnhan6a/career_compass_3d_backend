'use strict'

import HollandGroupModel from "../../models/hollandGroup.model.js";
import HollandQuestionModel from '../../models/hollandQuestion.model.js'

const findGroupByGroupName = async (group) => { 
    return await HollandGroupModel.findOne({ holland_code: group }).lean();
}

const getAllQuestionsByGroupName = async (groupName) => { 
    return await HollandQuestionModel.find({ question_code: groupName[0] }).select('question_code question_text -_id').lean();
}

export { findGroupByGroupName,getAllQuestionsByGroupName }