'use strict';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()


class Database {
    constructor() {
        this.connectDB();
    }

    // , { 
    //     maxPoolSize: 50 // cải thiện hiệu suất cho ứng dụng
    //     // nếu mà vượt quá poolSize thì nó xếp các connection vào ghàng đợi,
    //     // khi nào free connect thì mongoose đẩy connect đó vào trong thằng đầu tiên của hàng đợi
    // }

    async connectDB(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        await mongoose
            .connect(process.env.MONGO_URI)
            .then((_) => console.log(`Connect to database successfully PRO`))
            .catch((err) => console.log('Error connect!', err.message));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
