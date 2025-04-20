'use strict'

import MajorModel from '../../models/major.model.js'

// Lấy tất cả majors
const getAllMajors = async () => {
    return await MajorModel.find({}).lean();
}

// Lấy tất cả majors theo uni_code
const getAllMajorsByUnicode = async (uniCode) => {
    return await MajorModel.find({ uni_code: uniCode }).lean();
}

// Tạo mới major
const createMajor = async (majorData) => {
    const newMajor = new MajorModel(majorData);
    return await newMajor.save();
}

// Cập nhật major theo ID
const updateMajorById = async (majorId, updateData) => {
    return await MajorModel.findByIdAndUpdate(
        majorId,
        { $set: updateData },
        { new: true }
    ).lean();
}

// Xoá mềm major
const softDeleteMajorById = async (majorId) => {
    const major = await MajorModel.findById(majorId);
    if (!major) return null;
    await major.delete();
    return major.toObject();
}

// Khôi phục major đã xoá mềm
const restoreMajorById = async (majorId) => {
    const major = await MajorModel.findOneWithDeleted({ _id: majorId });
    if (!major) return null;
    await major.restore();
    return major.toObject();
}

// Xoá vĩnh viễn major
const deleteMajorById = async (majorId) => {
    return await MajorModel.findByIdAndDelete(majorId).lean();
}

export { getAllMajors, getAllMajorsByUnicode, createMajor, updateMajorById, softDeleteMajorById, restoreMajorById, deleteMajorById }