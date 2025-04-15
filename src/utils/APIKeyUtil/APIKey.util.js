'use strict'

import crypto from 'crypto'

const generateAPIKey = () => crypto.randomBytes(64).toString('hex')

export { generateAPIKey }