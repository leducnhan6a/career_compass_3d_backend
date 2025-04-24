import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import pushToDiscordLog from './middlewares/pushToDiscordBot.js';
import instanceMongodb from './dbs/init.mongodb.js';
import cronSchedule from './utils/cron/scrape.cron.js';
// import { swaggerUi, swaggerSpec } from './configs/swagger.config.js';
// import { checkOverload } from './helpers/check.connect.js';

const app = express();
const file = fs.readFileSync(path.resolve('src', 'career_compass_3d.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);
const environment = process.env.NODE_ENV || 'development';

// implement new Route
import accessRoutes from './routes/access.route.js';
import surveyRoutes from './routes/survey.route.js';
import majorRoutes from './routes/major.route.js';
import scraperRoutes from './routes/scraper.route.js';
import modelRoutes from './routes/model.route.js';

// init middleware
app.use(express.json()); // đọc được filejson từ req.body
app.use(morgan('dev')); // đầu ra ngắn gọn (không cần biết kĩ)
app.use(helmet()); // bảo vệ, mã hóa thông tin riêng tư
app.use(compression()); // hỗ trợ vận chuyển dữ liệu rất lớn
app.use(
    express.urlencoded({
        extended: true,
    }),
); // cho req.body
app.use(cors());
dotenv.config();

// init mongoDB database
instanceMongodb;
// checkOverload()


// API documentation
if (environment === 'development') {
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// middleware discord log bot
app.use(pushToDiscordLog);

// init route
app.use('/api/v1/access', accessRoutes);
app.use('/api/v1/survey', surveyRoutes);
app.use('/api/v1/major', majorRoutes);
app.use('/api/v1/event', scraperRoutes);
app.use('/api/v1/model', modelRoutes);

// handling error ngoài này
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        statusCode: statusCode,
        statusError: error,
        message: error.message || 'Internal server error',
    });
});

// Tự động crawl data từ các web
// cronSchedule();

export default app;
