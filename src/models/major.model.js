'use strict';

import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const DOCUMENT_NAME = 'Major';
const COLLECTION_NAME = 'Majors';

const majorSchema = new Schema(
    {
        major_uni_code: { type: String, required: true, trim: true},
        major_name: { type: String, required: true, trim: true},
        major_standard_score: { type: Number, required: true, max: 30},
        major_aptitude_trends: { type: Array, required: true, enum: ['R', 'I', 'A', 'S', 'E', 'C'], index: true}
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

majorSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// Model3DSchema.pre('save', function (next) {
//     if (!this.object3d_slug) {
//         this.object3d_slug = slugify(this.object3d_name, { lower: true });
//     }
//     next();
// });

const MajorModel = model(DOCUMENT_NAME, majorSchema);
export default MajorModel;
