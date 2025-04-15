'use strict';

import asyncHandler from '../helpers/asyncHandler.js';
import AccessService from '../services/access.service';
import { CREATED, SuccessResponse } from '../core/success.response.js';

class AccessController {
    signup = asyncHandler(async (req, res) => {
        const result = await AccessService.signUp(req.body);
        new CREATED({
            message: 'Registered successfully!',
            metadata: result,
        }).send(res);
    });

    login = asyncHandler(async (req, res) => {
        const result = await AccessService.logIn(req.body);
        new SuccessResponse({
            metadata: result,
        }).send(res);
    });

    logout = asyncHandler(async (req, res) => {
        const result = await AccessService.logOut(req.keyStore);
        new SuccessResponse({
            message: 'Logged out',
            metadata: result,
        }).send(res);
    });
}

export default new AccessController();
