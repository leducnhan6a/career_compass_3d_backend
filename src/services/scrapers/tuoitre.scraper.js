'use strict';

import axios from 'axios';
import * as cheerio from 'cheerio';

// Crawl danh sách bài viết từ tuoitre.vn/tu-van-tuyen-sinh-huong-nghiep-2025-e1258.htm
export async function scrapeTuoiTre() {
    // Gửi request và lấy HTML
    const { data } = await axios.get('https://tuoitre.vn/tu-van-tuyen-sinh-huong-nghiep-2025-e1258.htm');
    const $ = cheerio.load(data);

    const articleElements = $('h3.box-title-text a').toArray();

    const articlePromises = articleElements.map((element) =>
        (async () => {
            const title = $(element).text().trim(); // Tiêu đề

            // Lấy URL
            let url = $(element).attr('href').trim(); // URL bài
            if (url.startsWith('/')) url = 'https://tuoitre.vn' + url; // Nếu là đường dẫn tương đối, prepend domain

            // Lấy thumbnail
            const img = $(element).closest('.box-category-item').find('img');
            const thumbnail = img.attr('data-src') || img.attr('src') || img.attr('data-original');

            // Lấy ngày đăng
            const publishedTime = $(element).closest('.box-category-item').find('.second-label').attr('title');
            const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i.exec(publishedTime);
            if (!regex) return null;
            let [, ...parts] = regex;
            let [month, day, year, hour, minute, second] = parts.slice(0, 6).map((string) => parseInt(string, 10));
            let ampm = parts[6].toUpperCase();

            if (ampm === 'PM' && hour < 12) hour += 12;
            else if (ampm === 'AM' && hour === 12) hour = 0;

            const base = new Date(year, month - 1, day, hour, minute, second);
            if (isNaN(base.getTime())) return null;
            const publishedAt = new Date(base.getTime() + 7 * 60 * 60 * 1000) || new Date(); // GMT +7, cộng thêm 7 tiếng

            return { source: 'tuoitre', title, url, thumbnail, publishedAt };
        })(),
    );

    const articles = await Promise.all(articlePromises);

    return articles;
}
