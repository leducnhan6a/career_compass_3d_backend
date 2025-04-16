'use strict';

import userModel from '../../models/user.model.js';

const findUserByName = async ({
    name,
    select = {
        user_name: 1,
        user_password: 0,
        user_email: 1,
        user_gender: 0,
        user_permission: 1,
    },
}) => {
    return await userModel.findOne({ user_name: name }).select(select).lean();
};

export { findUserByName };
