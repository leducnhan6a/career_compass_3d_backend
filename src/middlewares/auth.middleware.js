'use strict';

import findById from '../services/apiKey.service.js';
import KeyTokenService from '../services/keyToken.service.js';

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
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied',
            });
        }

        console.log('permissions:: ', req.objKey.permission);

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission denied',
            });
        }

        return next();
    };
};

export { apiKey, permission };
