'use strict'

import crypto from 'crypto'
import { generateAPIKey } from '../utils/APIKeyUtil/APIKey.util.js'
import APIKeyModel from '../models/APIKey.model.js'
import { BadRequestError } from '../core/error.response.js'


class APIKeyService { 
    static async createAPIKey() { 
        // save apikey in database
        const newAPIKey = await APIKeyModel.create({ 
            APIKey_key: generateAPIKey(),
            APIKey_permissions: 'user'
        })

        if (!newAPIKey) { 
            throw new BadRequestError('Error create api key!!')
        }

        // return duoc apikey
        return newAPIKey
    }
}

export default APIKeyService