'use strict';

import AccessService from '../services/access.service.js';
import { CREATED, SuccessResponse } from '../core/success.response.js';

class AccessController {
    async signup (req, res) {
        const result = await AccessService.signUp(req.body);
        new CREATED({
            message: 'Registered successfully!',
            metadata: result,
        }).send(res);
    };

    async login (req, res) {
        const result = await AccessService.logIn(req.body);
        new SuccessResponse({
            message: 'Login successfully!',
            metadata: result,
        }).send(res);
    };

    async logout (req, res) {
        const result = await AccessService.logOut(req.keyStore);
        new SuccessResponse({
            message: 'Logged out',
            metadata: result,
        }).send(res);
    };
}

export default new AccessController();
