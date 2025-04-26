'use strict';

import { NotFoundError } from '../../core/error.response.js';
import userModel from '../../models/user.model.js';

// Tìm thông tin người dùng theo tên (username)
const findUserByName = async ({
    username,
    select = {
        user_name: 1,
        user_displayname: 1,
        user_email: 1,
        user_password: 1,
        user_permission: 1,
    },
}) => {
    return await userModel.findOne({ user_name: username }).select(select).lean();
};

const findUserByUserIdDelete = async ({
    userId,
    select = {
        user_name: 1,
        user_displayname: 1,
        user_email: 1,
        user_password: 1,
        user_permission: 1,
    },
}) => {
    return await userModel.findByIdAndDelete(userId).select(select).lean();
};

// Tìm thông tin người dùng theo email tài khoản
const findHistoryResultByUserId = async (userId) => {
    const foundUser = await userModel.findById(userId).lean();
    if (!foundUser.user_history) throw new NotFoundError('User history not found!');
    return foundUser.user_history;
};

// Cập nhật thông tin user
const findUserAndUpdate = async (userId, updateData) => {
    return await userModel.findByIdAndUpdate(userId, updateData);
};

const findUserAndDelete = async ({ userId }) => {
    const foundUserAndDelete = await findUserByUserIdDelete({ userId });
    if (!foundUserAndDelete) throw new NotFoundError('Cannot delete this user');

    return foundUserAndDelete;
};

export { findUserByName, findHistoryResultByUserId, findUserAndUpdate, findUserAndDelete };
