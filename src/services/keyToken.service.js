'use strict'

import keyTokenModel from "../models/keyToken.model.js";

import { Types } from 'mongoose'
import { convertToObjectIdMongoDB } from "../utils/convertToObjectIdMongoDB.js";

class KeyTokenService { 
    static generateToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = {
                    upsert: true, // chưa có thì thêm vô, có rồi thì update
                    new: true,
                };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: convertToObjectIdMongoDB(userId) }); // chỗ này thì phải check schema keytoken
    };

    static removeKeyById = async (id) => {
        const deletedResult = await keyTokenModel.deleteOne({
            _id: convertToObjectIdMongoDB(id),
        });
        return deletedResult;
    };
    
}

export default KeyTokenService