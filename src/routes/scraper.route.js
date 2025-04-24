'use strict';

import express from 'express';
import ScraperController from '../controllers/scraper.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';
import { permission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Xác thực đã đăng nhập
router.use(authenticationV2);

// -----------------------------------------------------------------------

// Check user permission
router.use(permission('user'));

// Lấy tất cả bài viết đã crawl
router.get('/', asyncHandler(ScraperController.getAllArticles));

// -----------------------------------------------------------------------

// check admin permission
router.use(permission('admin'));

// lấy trash articles
router.get('/trash', asyncHandler(ScraperController.getTrashArticles));

// Tạo mới bài viết thủ công
router.post('/create', asyncHandler(ScraperController.createArticle));

// Xoá mềm
router.patch('/:scraperId/delete', asyncHandler(ScraperController.softDelete));

// Khôi phục item bị xoá mềm
router.patch('/:scraperId/restore', asyncHandler(ScraperController.restore));

// Xoá vĩnh viễn
router.delete('/:scraperId/delete', asyncHandler(ScraperController.deletePermanently));

export default router;
