'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import ScraperService from '../services/scraper.service.js';

class ScraperController {
    async getAllArticles(req, res) {
        const result = await ScraperService.getAllArticles();
        new SuccessResponse({
            message: 'Get all articles successfully',
            metadata: result,
        }).send(res);
    }

    async getTrashArticles(req, res) {
        const result = await ScraperService.getTrashArticles();
        new SuccessResponse({
            message: 'Get trash articles successfully',
            metadata: result,
        }).send(res);
    }

    async createArticle(req, res) {
        const result = await ScraperService.createArticle(req);
        new CREATED({
            message: 'Article created manually',
            metadata: result,
        }).send(res);
    }

    async softDelete(req, res) {
        const result = await ScraperService.softDelete(req);
        new SuccessResponse({
            message: 'Article soft deleted',
            metadata: result,
        }).send(res);
    }

    async restore(req, res) {
        const result = await ScraperService.restore(req);
        new SuccessResponse({
            message: 'Article restored',
            metadata: result,
        }).send(res);
    }

    async deletePermanently(req, res) {
        const result = await ScraperService.deletePermanently(req);
        new SuccessResponse({
            message: 'Article permanently deleted',
            metadata: result,
        }).send(res);
    }
}

export default new ScraperController();
