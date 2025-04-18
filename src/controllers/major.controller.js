'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import MajorService from '../services/major.service.js';

class MajorController {
    
    // Lấy thông tin ngành có cùng mã trường
    async getMajorsByUniCode(req, res) {
        const result = await MajorService.getMajorsByUniCode(req);
        new SuccessResponse({
            message: 'Get majors by university code successfully',
            metadata: result,
        }).send(res);
    }

    // Tạo mới một ngành
    async createMajor(req, res) {
        const result = await MajorService.createMajor(req);
        new CREATED({
            message: 'Major created successfully',
            metadata: result,
        }).send(res);
    }

    // Cập nhật lại thông tin ngành
    async updateMajor(req, res) {
        const result = await MajorService.updateMajor(req);
        new SuccessResponse({
            message: 'Major updated successfully',
            metadata: result,
        }).send(res);
    }


    // Xoá mềm một ngành có sẵn
    async softDeleteMajor(req, res) {
        const result = await MajorService.softDeleteMajor(req);
        new SuccessResponse({
            message: 'Major soft deleted',
            metadata: result,
        }).send(res);
    }

    // Khôi phục lại ngành bị xoá mềm
    async restoreMajor(req, res) {
        const result = await MajorService.restoreMajor(req);
        new SuccessResponse({
            message: 'Major restored',
            metadata: result,
        }).send(res);
    }

    // Xoá vĩnh viễn một ngành (ko khôi phục đc)
    async deleteMajorPermanently(req, res) {
        const result = await MajorService.deleteMajor(req);
        new SuccessResponse({
            message: 'Major permanently deleted',
            metadata: result,
        }).send(res);
    }

    // Lấy các majors có chứa một trong 3 khuynh hướng
    async getMajorsIncludeAptitude(req, res) {
        const result = await MajorService.searchMajorsByAptitude(req);
        new SuccessResponse({
            message: 'Get majors include aptitude successfully',
            metadata: result,
        }).send(res);
    }
}

export default new MajorController();