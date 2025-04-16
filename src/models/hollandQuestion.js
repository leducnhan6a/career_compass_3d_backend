'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'HollandQuestion';
const COLLECTION_NAME = 'HollandQuestions';

const hollandQuestionSchema = new Schema(
    {
        question_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        question_text: {
            type: String,
            required: true,
            trim: true,
        },

        question_type: {
            type: Schema.Types.ObjectId,
            ref: 'HollandGroup',
            required: true,
        },

        question_options: [
            {
                option_text: {
                    type: String,
                    required: true,
                    trim: true,
                },
                option_value: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const HollandQuestionModel = model(DOCUMENT_NAME, hollandQuestionSchema);
export default HollandQuestionModel;
