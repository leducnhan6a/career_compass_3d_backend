'use strict'

import LoggerService from '../logger/discord.log.js'

const pushToDiscordLog = async (req, res, next) => { 
    try {
        LoggerService.sendToFormatcode({ 
            title: `${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`
        })
        
        return next()
    } catch (error) {
        next(error)
    }
}

export default pushToDiscordLog