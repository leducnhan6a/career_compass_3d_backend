'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'HollandGroup';
const COLLECTION_NAME = 'HollandGroups';

const hollandGroupSchema = new Schema(
    {
        holland_code: {
            type: String, // R, I, A, S, E, C
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
            enum: ['R', 'I', 'A', 'S', 'E', 'C'],
        },
        holland_full_code: {
            type: String, // Realistic, Investigative, Artistic...
            required: true,
            unique: true,
            trim: true,
        },
        holland_name: {
            type: String, // Thực tế, Nghiên cứu, Nghệ thuật...
            required: true,
            trim: true,
        },
        holland_description: {
            type: String, // Nhóm người thích A, Nhóm người thích B, ....
            required: false,
            trim: true,
        },
        holland_totalQuestions: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const HollandGroupModel = model(DOCUMENT_NAME, hollandGroupSchema);
export default HollandGroupModel;
