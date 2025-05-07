'use strict';

import cron from 'node-cron';
import { scrapeVnExpress } from '../../services/scrapers/vnexpress.scraper.js';
import { scrapeTuoiTre } from '../../services/scrapers/tuoitre.scraper.js';
import ScraperService from '../../services/scraper.service.js';

const jobs = [
    { name: 'VnExpress', fn: scrapeVnExpress },
    { name: 'TuoiTre', fn: scrapeTuoiTre },
];

// Schedule job chạy mỗi 60 phút: '* * * * *'
const cronSchedule = () => {
    jobs.forEach(({ name, fn }) => {
        cron.schedule('0 * * * *', async () => {
            console.log(`[${new Date().toISOString()}] Starting ${name} scrape`);
            try {
                const articles = await fn();
                for (const article of articles) {
                    await ScraperService.createArticle({ body: article }).catch((err) => {
                        if (!/already exists/.test(err.message)) console.error(err);
                    });
                }
                console.log(`[${new Date().toISOString()}] ${name} scrape completed`);
            } catch (e) {
                console.error(`Error in ${name} cron:`, error);
            }
        });
    });
};

export default cronSchedule;
