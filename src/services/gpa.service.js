import { BadRequestError } from '../core/error.response.js';
import { saveGPAResult, getGPAHistory } from './repositories/gpa.service.js';

// Các khối thi
const examBlocks = {
    A00: ['Toán', 'Lý', 'Hóa'],
    A01: ['Toán', 'Lý', 'Anh'],
    B00: ['Toán', 'Hóa', 'Sinh'],
    C00: ['Văn', 'Sử', 'Địa'],
    D01: ['Văn', 'Toán', 'Anh'],
    D02: ['Văn', 'Toán', 'Sinh'],
    D03: ['Văn', 'Toán', 'Lý'],
    D04: ['Văn', 'Toán', 'Hóa'],
};

class GPAService {
    static getGPAMethods() {
        return [
            { code: '3_years', description: 'Xét học bạ 3 năm (Cả năm lớp 10, 11, 12)' },
            { code: '12_all_year', description: 'Xét học bạ cả năm lớp 12' },
            { code: '6_semesters', description: 'Xét học bạ 6 học kỳ' },
            { code: '10_11_12_hk1', description: 'Xét học bạ lớp 10, lớp 11, HK1 lớp 12' },
            { code: '3_semesters', description: 'Xét học bạ 3 học kỳ' },
            { code: '5_semesters', description: 'Xét học bạ 5 học kỳ' },
        ];
    }

    static async getGPAresult({ body }) {
        const { userId, method, regionPriority = 0, objectPriority = 0, scores = {} } = body;
        if (!userId) throw new BadRequestError('userId is required');
        if (!method) throw new BadRequestError('Calculation method is required');

        const usedPriority = parseFloat((regionPriority + objectPriority).toFixed(2));

        // Danh sách tất cả môn từ các khối
        const allSubjects = Array.from(new Set(Object.values(examBlocks).flat()));
        const subjectAverages = {};

        // Tính điểm trung bình mỗi môn, nếu không có dữ liệu thì mặc định 0
        allSubjects.forEach((subject) => {
            const data = scores[subject] || {};
            let avg;
            switch (method) {
                case '3_years':
                    avg = ((data.year10 || 0) + (data.year11 || 0) + (data.year12 || 0)) / 3;
                    break;
                case '12_all_year':
                    avg = data.year12 || 0;
                    break;
                case '6_semesters':
                    avg =
                        ((data.hk10_1 || 0) +
                            (data.hk10_2 || 0) +
                            (data.hk11_1 || 0) +
                            (data.hk11_2 || 0) +
                            (data.hk12_1 || 0) +
                            (data.hk12_2 || 0)) /
                        6;
                    break;
                case '10_11_12_hk1':
                    avg = ((data.year10 || 0) + (data.year11 || 0) + (data.hk12_1 || 0)) / 3;
                    break;
                case '3_semesters':
                    avg = ((data.sem1 || 0) + (data.sem2 || 0) + (data.sem3 || 0)) / 3;
                    break;
                case '5_semesters':
                    avg =
                        ((data.sem1 || 0) + (data.sem2 || 0) + (data.sem3 || 0) + (data.sem4 || 0) + (data.sem5 || 0)) /
                        5;
                    break;
                default:
                    throw new BadRequestError(`Unknown calculation method: ${method}`);
            }
            subjectAverages[subject] = parseFloat(avg.toFixed(2));
        });

        // Tính kết quả cho từng khối thi
        const blockResults = Object.entries(examBlocks).map(([block, subjects]) => {
            const rawScore = subjects.reduce((sum, sub) => sum + (subjectAverages[sub] || 0), 0);
            const blockScore = parseFloat(rawScore.toFixed(2));

            let finalPriority;
            if (blockScore < 22.5) {
                finalPriority = usedPriority;
            } else {
                finalPriority = parseFloat((((30 - blockScore) / 7.5) * usedPriority).toFixed(2));
            }
            const totalScore = parseFloat((blockScore + finalPriority).toFixed(2));

            return { block, subjects, blockScore, usedPriority, finalPriority, totalScore };
        });

        const createdAt = new Date();
        const result = { method, usedPriority, subjectAverages, blockResults, createdAt };

        // Lưu lịch sử
        await saveGPAResult(userId, result);
        return result;
    }

    static async getGPAHistory({ query: { userId } }) {
        if (!userId) throw new BadRequestError('userId is required');
        return await getGPAHistory(userId);
    }
}

export default GPAService;
