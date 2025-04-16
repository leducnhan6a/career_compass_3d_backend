'use strict';

import { Schema, model } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const DOCUMENT_NAME = 'HollandQuestion';
const COLLECTION_NAME = 'HollandQuestions';

const hollandQuestionSchema = new Schema(
    {
        question_code: {
            type: String,
            ref: 'HollandGroup',
            required: true,
            index: true,
            enum: ['R', 'I', 'A', 'S', 'E', 'C']
        }, // ??? 

        question_text: {
            type: String,
            required: true,
            trim: true,
        }

        // question_options: [
        //     {
        //         option_text: {
        //             type: String,
        //             required: true,
        //             trim: true,
        //         },
        //         option_value: {
        //             type: Number,
        //             required: true,
        //         },
        //     },
        // ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

hollandQuestionSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

const HollandQuestionModel = model(DOCUMENT_NAME, hollandQuestionSchema);
export default HollandQuestionModel;
