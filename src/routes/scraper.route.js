'use strict';

import express from 'express';
import ScraperController from '../controllers/scraper.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// Xác thực đã đăng nhập
router.use(authenticationV2);

// Lấy tất cả bài viết đã crawl
router.get('/', asyncHandler(ScraperController.getAllArticles));

// Tạo mới bài viết thủ công (nếu muốn test)
router.post('/create', asyncHandler(ScraperController.createArticle));

// Xoá mềm
router.patch('/sdel/:scraperId', asyncHandler(ScraperController.softDelete));

// Khôi phục item bị xoá mềm
router.patch('/restore/:scraperId', asyncHandler(ScraperController.restore));

// Xoá vĩnh viễn
router.delete('/del/:scraperId', asyncHandler(ScraperController.deletePermanently));

export default router;
