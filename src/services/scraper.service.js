'use strict';

import {
    getAllArticles,
    createArticle,
    softDeleteById,
    restoreById,
    deleteById,
} from './repositories/scraper.service.js';

import { BadRequestError, NotFoundError } from '../core/error.response.js';

class ScraperService {
    static async getAllArticles() {
        return await getAllArticles();
    }

    static async createArticle({ body: { source, title, url, publishedAt = Date.now(), thumbnail } }) {
        const result = await createArticle({ source, title, url, publishedAt, thumbnail });
        if (!result) throw new BadRequestError('Failed to create article');

        return result;
    }

    static async softDelete({ params: { scraperId } }) {
        const result = await softDeleteById(scraperId);
        if (!result) throw new NotFoundError('Article not found');

        return result;
    }

    static async restore({ params: { scraperId } }) {
        const result = await restoreById(scraperId);
        if (!result) throw new NotFoundError('Article not found');

        return result;
    }

    static async deletePermanently({ params: { scraperId } }) {
        const result = await deleteById(scraperId);
        if (!result) throw new NotFoundError('Article not found');

        return result;
    }
}

export default ScraperService;
