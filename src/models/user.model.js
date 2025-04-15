'use strict'

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema(
    {
        user_name: {
            trim: true, // xoá khoảng trắng thừa
            type: String,
            required: true,
            unique: true,
        },

        user_password: {
            // cần thêm phần required hash phía trước
            type: String, 
            required: true,
        },

        user_email: {
            type: String,
            required: true,
            unique: true,
        },

        user_gender: {
            type: String,
            required: true,
        },

        user_avatar: {
            type: String, // Đường dẫn đến file ảnh avatar
            default: '../../public/img/defaultAvt.jpg', // Giá trị mặc định là ảnh default avt
            required: false,
        },

        user_api_key: {
            type: String,
            required: true,
        },

        user_permission: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        user_history: [
            {
                // Chưa xác định rõ. Sẽ thay đổi trong tương lai.
                action: String,
                timestamp: {
                    type: Date,
                    default: Date.now(),
                },
                metadata: Schema.Types.Mixed, // data linh hoạt
            },
        ],
    },
    {
        timestamp: true,
        collection: COLLECTION_NAME,
    },
);

const userModel = model(DOCUMENT_NAME, userSchema);
export default userModel;