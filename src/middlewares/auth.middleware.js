'use strict';

import userModel from "../models/user.model.js";


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden error!!',
            });
        }
        // check objKey is exist in apikeymodel ?? 
        // const objKey = await KeyTokenService(key);

        
        // if not have this key then return
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden error!',
            });
        }

        req.objKey = objKey;

        return next();
    } catch (error) {
        console.error('Error something');
    }
};

const permission = (permission) => {
    return async (req, res, next) => {

        // check permission user
        const foundUser = await userModel.findById(req.user.userId).select('user_permission').lean()
        if (!foundUser) {
            return res.status(403).json({
                message: 'Permission denied',
            });
        }

        const validPermission = foundUser.user_permission === permission;
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission denied',
            });
        }

        return next();
    };
};

export { apiKey, permission };
