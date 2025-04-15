'use strict'

import userModel from '../models/user.model';

const findByName = async ({
    name,
    select = {
        user_name: 1,
        user_password: 1,
        user_email: 1,
        user_gender: 1,
        user_permission: 1,
    },
}) => {
    return await userModel.findOne({ user_name: name }).select(select).lean();
};

export { findByName };
