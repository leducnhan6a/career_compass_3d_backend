'use strict'
import { Types } from "mongoose"

const convertToObjectIdMongoDB = id => new Types.ObjectId(id)

export { convertToObjectIdMongoDB }