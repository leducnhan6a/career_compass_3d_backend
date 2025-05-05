'use strict';

import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import validator from 'validator';

import KeyTokenService from './keyToken.service.js';
import { findUserByName, findUserByEmail, createUser, findUserAndDelete } from './repositories/user.service.js';
import { createTokenPair } from '../utils/AuthUtil/auth.util.js';
import { getIntoData } from '../utils/getIntoData.util.js';
import { BadRequestError, AuthFailureError, NotFoundError, ConflictRequestError } from '../core/error.response.js';

class AccessService {
    static async signUp({ email, displayname, username, password, gender }) {
        // find user
        if (!validator.isEmail(email)) throw new BadRequestError('Invalid email format');
        if (await findUserByName(username)) throw new ConflictRequestError('Username is already registered');
        if (await findUserByEmail(email)) throw new ConflictRequestError('Email is already registered');

        // hashpassword
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // create new user in userModel
        let newUser;
        try {
            newUser = await createUser({
                user_email: email,
                user_name: username,
                user_displayname: displayname,
                user_gender: gender,
                user_password: hashedPassword,
            });
        } catch (error) {
            if (error.code === 11000) {
                const rawField = Object.keys(error.keyPattern)[0];
                const fieldMap = { user_email: 'Email', user_name: 'Username' };
                const label = fieldMap[rawField] || rawField;
                throw new ConflictRequestError(`${label} is already registered`);
            }
            throw error;
        }

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
                user: getIntoData({
                    fields: ['_id', 'user_name', 'user_email', 'user_permission', 'user_displayname'],
                    object: newUser,
                }),
                tokens: tokens.accessToken,
            };
        }
    }

    static async logIn({ username, email, password }) {
        let foundUser;
        if (email) {
            if (!validator.isEmail(email)) throw new BadRequestError('Invalid email');
            foundUser = await findUserByEmail({ email });
        } else if (username) {
            foundUser = await findUserByName({ username });
        } else {
            throw new BadRequestError('Username or email is required');
        }

        if (!foundUser) throw new NotFoundError('User not found');

        // Check password
        const isPasswordValid = await bcryptjs.compare(password, foundUser.user_password);
        if (!isPasswordValid) throw new AuthFailureError('Invalid password');

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const { _id: userId } = foundUser;
        const tokens = await createTokenPair({ userId, username }, publicKey, privateKey);

        const keyStore = await KeyTokenService.generateToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore) throw new BadRequestError('Failed to generate keystore');
        return {
            user: getIntoData({
                fields: ['_id', 'user_name', 'user_email', 'user_displayname', 'user_permission'],
                object: foundUser,
            }),
            tokens: tokens.accessToken,
        };
    }

    static async logOut({ keyStore }) {
        if (!keyStore?._id) throw new BadRequestError('Invalid keystore');
        const result = await KeyTokenService.removeKeyById(keyStore._id);
        if (!result) throw new BadRequestError('Failed to remove keystore');
        return { message: 'Logged out successfully' };
    }

    static async permanentDeleteUser({ body: { userId } }) {
        if (!userId) throw new NotFoundError('User not found');
        const deletedUser = await findUserAndDelete({ userId });
        return deletedUser;
    }
}

export default AccessService;
