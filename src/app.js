import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

// import pushToDiscordLog from './middleware/pushToDiscordBot.js';
// import instanceMongodb from './dbs/init.mongodb.js';
import { checkOverload } from './helpers/check.connect.js'

const app = express();

// implement new Route

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
dotenv.config();

// init mongoDB database
// instanceMongodb
checkOverload()

// middleware discord log bot
// app.use(pushToDiscordLog)

// init route

// handling error ngoài này
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        code: statusCode,
        status: 'error' + error.stack,
        message: error.message || 'Internal server error',
    });
});

export default app
