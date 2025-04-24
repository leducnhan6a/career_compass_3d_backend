'use strict';

import { NotFoundError, BadRequestError } from '../core/error.response.js';
import {
    getAllMajors,
    getAllMajorsByUnicode,
    createMajor,
    updateMajorById,
    softDeleteMajorById,
    restoreMajorById,
    deleteMajorById,
    findAllDeletedmajors
} from './repositories/major.service.js';

class MajorService {

    // Lấy danh sách ngành theo mã trường
    static async getMajorsByUniCode({ query: { uni_code } }) {
        const majorList = await getAllMajorsByUnicode(uni_code);
        if (!majorList || majorList.length === 0) throw new NotFoundError('No majors found for this university');
        return majorList;
    }

    static async getTrashMajors({ query: { sort = 'ctime' } }) {
        const unselect = ['deleted']
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 };
        const deletedMajors = await findAllDeletedmajors({ unselect, sortBy });
        return deletedMajors;
    }

    // Thêm ngành mới
    static async createMajor({ body }) {
        const { uni_code, major_name, major_standard_score, major_aptitude_trends } = body;
        const newMajor = await createMajor({ uni_code, major_name, major_standard_score, major_aptitude_trends });
        if (!newMajor) throw new BadRequestError('Cannot create new major');
        return newMajor;
    }

    // Cập nhật ngành
    static async updateMajor({ params: { majorId }, body: updateData }) {
        const updated = await updateMajorById(majorId, updateData);
        if (!updated) throw new BadRequestError('Cannot update major');
        return updated;
    }

    // Xoá mềm ngành
    static async softDeleteMajor({ params: { majorId } }) {
        const deleted = await softDeleteMajorById(majorId);
        if (!deleted) throw new BadRequestError('Cannot soft delete major');
        return deleted;
    }

    // Khôi phục ngành đã xoá mềm
    static async restoreMajor({ params: { majorId } }) {
        const restored = await restoreMajorById(majorId);
        if (!restored) throw new BadRequestError('Cannot restore major');
        return restored;
    }

    // Xoá cứng ngành
    static async deleteMajor({ params: { majorId } }) {
        const removed = await deleteMajorById(majorId);
        if (!removed) throw new BadRequestError('Cannot delete major');
        return removed;
    }
    
    // Tìm các thông tin có xu hướng phù hợp theo mức độ 3 > 2 > 1
    static async searchMajorsByAptitude({ query: { traits } }) {
        if (!traits || typeof(traits) !== "string" || traits.length > 3) throw new BadRequestError("Invalid traits queried");
        
        const inputTraits = traits.toUpperCase().split("");
        const allMajors = await getAllMajors();
        const matchesMajors = {
            fullMatched: [],
            partialMatched: [],
            singleMatched: []
        }

        for (const major of allMajors) {
            const matchingCount = major.major_aptitude_trends.filter(trait => inputTraits.includes(trait)).length;
            if (matchingCount === 3) {
                matchesMajors.fullMatched.push(major);
            } else if (matchingCount === 2) {
                matchesMajors.partialMatched.push(major);
            } else {
                matchesMajors.singleMatched.push(major);
            }
        }
        
        return matchesMajors;
    }

}

export default MajorService;