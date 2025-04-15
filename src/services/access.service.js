'use strict';

import userModel from '../models/user.model.js';
import { BadRequestError } from '../core/error.response.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

// import KeyTokenService from './keyToken.service.js';
import { createTokenPair } from '../auth/auth.util.js';
import APIKeyService from './apiKey.service.js';
import { getIntoData } from '../utils/getIntoData.util.js';

class AccessService {
    static async signup({ email, name, password, gender }) {
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

            // const keyStore = await KeyTokenService.generateToken({
            //     userId: newUser._id,
            //     privateKey,
            //     publicKey,
            // });

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

        return {
            code: 200,
            metadata: null,
        };

    }
}

export default AccessService;
