'use strict';

import { BadRequestError } from '../../core/error.response.js';
import jwt from 'jsonwebtoken';
import KeyTokenService from '../../services/keyToken.service.js';

const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = jwt.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        // thực ra chỗ này không cần thiết, vì chúng ta đang debug trên dev
        // jwt.verify(accessToken, publicKey, (err, decode) => {
        //     if (err) {
        //         console.error('Error:: ', err)
        //     } else {
        //         console.log('Decode::: ', decode)
        //     }
        // })

        const tokens = { accessToken, refreshToken };
        return tokens;
    } catch (error) {
        throw new BadRequestError('Invalid token');
    }
};

const authenticationV2 = async (req, res, next) => {
    /*
        1. check userId missing
        2. get access token
        3. verify token
        4. check use in database
        5. check keystore with useId
        6. -OK return next
        headers: { 
            x-client-id: userId,
            authorization: accessToken
        }
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    // không có clientID thì trả về lỗi ngay
    if (!userId) throw new AuthFailureError('Invalid request');

    //2
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found key store');

    // 2.5
    // if (req.headers[HEADER.REFRESHTOKEN]) {
    //     try {
    //         // accesstoken -> publickey
    //         // refresh token -> privateKey
    //         const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    //         const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
    //         if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId');
    //         req.keyStore = keyStore; // { access, refreshToken }
    //         req.user = decodeUser; // { userId , name }
    //         req.refreshToken = refreshToken;
    //         return next();
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // 3 verify
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request');

    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId');
        req.keyStore = keyStore;
        req.user = decodeUser; // { userId , email }
        return next();
    } catch (error) {
        throw error;
    }
};

// const verifyJWT = async (token, keySecret) => {
//     return await jwt.verify(token, keySecret);
// };

export { createTokenPair, authenticationV2 };
