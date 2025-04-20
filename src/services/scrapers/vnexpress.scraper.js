'use strict';

import axios from 'axios';
import * as cheerio from 'cheerio';

// Crawl danh sách bài viết từ VnExpress/giao-duc/tuyen-sinh/dai-hoc
export async function scrapeVnExpress() {
    // Gửi request và lấy HTML
    const { data } = await axios.get('https://vnexpress.net/giao-duc/tuyen-sinh/dai-hoc');
    const $ = cheerio.load(data);

    const articleElements = $('h2.title-news a').toArray();

    const articlePromises = articleElements.map((element) =>
        (async () => {
            const title = $(element).text().trim();
            const url = $(element).attr('href');
            const img = $(element).closest('article').find('img');
            const thumbnail = img.attr('data-src') || img.attr('data-original') || img.attr('src');

            // Fetch chi tiết bài viết để lấy thời gian đăng
            let publishedAt = new Date();
            try {
                const detail = await axios.get(url);
                const _$ = cheerio.load(detail.data);
                const publishedTime = _$('span.date').text().trim();
                if (publishedTime) {
                    // Regex bắt dd/mm/yyyy và hh:mm
                    const regex = /(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})/.exec(publishedTime);
                    if (!regex) return null;

                    const [, day, month, year, hour, minute] = regex.map((string) => parseInt(string, 10));
                    const base = new Date(year, month - 1, day, hour, minute);
                    if (isNaN(base.getTime())) return null;

                    publishedAt = new Date(base.getTime() + 7 * 60 * 60 * 1000) || new Date(); // GMT +7, cộng thêm 7 tiếng
                }
            } catch (error) {
                console.error(`Lỗi khi lấy chi tiết bài viết: ${url}`, error.message);
            }

            return { source: 'vnexpress', title, url, thumbnail, publishedAt };
        })(),
    );

    const articles = await Promise.all(articlePromises);

    return articles;
}
