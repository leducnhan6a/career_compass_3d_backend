'use strict';

import { Schema, model } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const DOCUMENT_NAME = 'Scraper';
const COLLECTION_NAME = 'Scrapers';

const scraperSchema = new Schema(
    {
        source: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        url: { type: String, required: true, unique: true },
        publishedAt: { type: Date },
        thumbnail: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

scraperSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

const ScraperModel = model(DOCUMENT_NAME, scraperSchema);
export default ScraperModel;
