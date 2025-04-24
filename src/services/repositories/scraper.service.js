'use strict';

import ScraperModel from '../../models/scraper.model.js'
import { unGetSelectData } from '../../utils/selectDataOptions.js';

// Lấy tất cả bài viết có trong db
const getAllArticles = async () => {
    return await ScraperModel.find({}).sort({ publishedAt: -1 }).lean();
};

const getTrashArticle = async () => { 
    return await ScraperModel.findDeleted().select(unGetSelectData(['deleted'])).sort({ createdAt: -1 }).lean();
}

// Tạo mới một bài viết
const createArticle = async (scraperData) => {
    const article = new ScraperModel(scraperData);
    return await article.save();
};

// Xoá mềm
const softDeleteById = async (scraperId) => {
    const article = await ScraperModel.findById(scraperId);
    if (!article) return null;

    await article.delete();
    return article.toObject();
};

// Khôi phục
const restoreById = async (scraperId) => {
    const article = await ScraperModel.findOneWithDeleted({ _id: scraperId });
    if (!article) return null;
    
    await article.restore();
    return article.toObject();
};

// Xoá cứng
const deleteById = async (scraperId) => {
    return await ScraperModel.findByIdAndDelete(scraperId).lean();
};

export { getAllArticles, createArticle, softDeleteById, restoreById, deleteById, getTrashArticle};
