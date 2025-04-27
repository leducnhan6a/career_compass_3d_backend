import { SuccessResponse } from '../core/success.response.js';
import GPAService from '../services/gpa.service.js';

class GPAController {
    // Check user permission
    async getGPACalcMethods(req, res) {
        const result = GPAService.getGPAMethods();
        new SuccessResponse({ message: 'Get GPA methods successfully', metadata: result }).send(res);
    }

    // Calculate GPA
    async getGPAresult(req, res) {
        const result = await GPAService.getGPAresult(req);
        new SuccessResponse({ message: 'Get GPA result successfully', metadata: result }).send(res);
    }

    // Get GPA history
    async getGPAHistory(req, res) {
        const result = await GPAService.getGPAHistory(req);
        new SuccessResponse({ message: 'Get GPA history successfully', metadata: result }).send(res);
    }
}

export default new GPAController();
