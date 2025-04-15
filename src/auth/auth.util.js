'use strict'

import { BadRequestError } from '../core/error.response'
import jwt from 'jsonwebtoken'

const createTokenPair = async (payload, publicKey, privateKey) => { 
    try {
        const accessToken = jwt.sign(payload, publicKey, { 
            expiresIn: '2 days'
        })

        const refreshToken = jwt.sign(payload, privateKey, { 
            expiresIn: '7 days'
        })


        // thực ra chỗ này không cần thiết, vì chúng ta đang debug trên dev
        // jwt.verify(accessToken, publicKey, (err, decode) => { 
        //     if (err) { 
        //         console.error('Error:: ', err)
        //     } else { 
        //         console.log('Decode::: ', decode)
        //     }
        // })
        const tokens = { accessToken, refreshToken }
        return tokens
    } catch (error) {
        next(error)
    }
}

export { createTokenPair }