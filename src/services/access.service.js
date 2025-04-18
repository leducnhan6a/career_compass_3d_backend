'use strict';

import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

import { findUserByName } from './repositories/user.service.js';
import APIKeyService from './apiKey.service.js';
import userModel from '../models/user.model.js';
import KeyTokenService from './keyToken.service.js';
import { createTokenPair } from '../utils/AuthUtil/auth.util.js';
import { getIntoData } from '../utils/getIntoData.util.js';
import { BadRequestError, AuthFailureError, NotFoundError } from '../core/error.response.js';

class AccessService {
    static async signUp({ email, name, password, gender }) {
        // find user
        const foundUser = await userModel.findOne({ user_email: email });
        // if have user then return error
        if (foundUser) throw new BadRequestError('User already exists');

        // validate email, name, oasspassword (su dung thu vien nao do de validate)

        // hashpassword
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // tao moi user trong userModel
        const newUser = await userModel.create({
            user_api_key: await APIKeyService.createAPIKey(),
            user_gender: gender,
            user_email: email,
            user_name: name,
            user_password: hashedPassword,
        });

        // neu tao duoc user moi thi bat dau
        if (newUser) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            const keyStore = await KeyTokenService.generateToken({
                userId: newUser._id,
                privateKey,
                publicKey,
            });

            if (!keyStore) {
                return {
                    message: 'Error keyStore',
                };
            }

            const tokens = await createTokenPair(
                {
                    userId: newUser._id,
                },
                publicKey,
                privateKey,
            );

            return {
                user: getIntoData({ fields: ['_id', 'user_name', 'user_email'], object: newUser }),
                tokens,
            };
        }
    }

    static async logIn({ name, password }) {
        const foundUser = await findUserByName({ name });
        if (!foundUser) throw new NotFoundError('Invalid input');

        const isPasswordValid = await bcryptjs.compare(password, foundUser.user_password);
        if (!isPasswordValid) throw new AuthFailureError('Invalid password');

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const { _id: userId } = foundUser;
        const tokens = await createTokenPair({ userId, name }, publicKey, privateKey);

        const keyStore = await KeyTokenService.generateToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore) throw new BadRequestError('Failed to generate keystore');
        return {
            user: getIntoData({ fields: ['_id', 'user_name', 'user_email', 'user_permission'], object: foundUser }),
            tokens,
        };
    }

    static async logOut(keyStore) {
        if (!keyStore?._id) throw new BadRequestError('Invalid keystore');
        const result = await KeyTokenService.removeKeyById(keyStore._id);
        if (!result) throw new BadRequestError('Failed to remove keystore');
        return { message: 'Logged out successfully' };
    }
}

export default AccessService;
