import { findUserAndUpdate, findHistoryResultByUserId } from './user.service.js';

const saveGPAResult = async (userId, data) => {
    return await findUserAndUpdate(userId, {
        $push: { user_history: { action: 'gpa_result', metadata: data } },
    });
};

const getGPAHistory = async (userId) => {
    const history = await findHistoryResultByUserId(userId);
    return Array.isArray(history) ? history.filter((h) => h.action === 'gpa_result') : [];
};

export { saveGPAResult, getGPAHistory };