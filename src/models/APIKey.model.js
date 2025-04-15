'use strict';
import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'APIKey';
const COLLECTION_NAME = 'APIKeys';

// mdbgum

const APIKeySchema = new Schema(
    {
        APIKey_key: {
            type: String,
            required: true,
            unique: true,
        },
        APIKey_status: {
            type: Boolean,
            default: true
        },
        APIKey_permissions: {
            type: [String],
            required: true,
            enum: ['user', 'admin'],
            default: 'user'
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
const APIKeyModel = model(DOCUMENT_NAME, APIKeySchema);
export default APIKeyModel;