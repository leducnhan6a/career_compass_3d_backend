'use strict';

import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const DOCUMENT_NAME = 'Object3D';
const COLLECTION_NAME = 'Object3Ds';

const object3DSchema = new Schema(
    {
        object3d_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        object3d_description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        object3d_slug: {
            type: String,
            required: [true, 'Slug là bắt buộc.'],
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[a-z0-9-]+$/,
        },
        object3d_thumbnailUrl: {
            type: String,
            required: true,
            trim: true,
            validate: validator.isURL,
        },
        object3d_modelUrl: {
            type: String,
            required: true,
            trim: true,
            validate: validator.isURL,
        },
        object3d_author: {
            type: String,
            trim: true,
            maxlength: 100
        },
        isDeleted: { 
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

object3DSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// Model3DSchema.pre('save', function (next) {
//     if (!this.object3d_slug) {
//         this.object3d_slug = slugify(this.object3d_name, { lower: true });
//     }
//     next();
// });

const Object3DModel = model(DOCUMENT_NAME, object3DSchema);
export default Object3DModel;
