'use strict'

import keyTokenModel from "../models/keyToken.model.js";

import { Types } from 'mongoose'

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
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }); // chỗ này thì phải check schema keytoken
    };

    static removeKeyById = async (id) => {
        const deletedResult = await keyTokenModel.deleteOne({
            _id: new Types.ObjectId(id),
        });
        return deletedResult;
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel
            .findOne({
                refreshTokensUsed: refreshToken,
            })
            .lean();
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    };

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteMany({ user: new Types.ObjectId(userId) });
    };

    
}

export default KeyTokenService