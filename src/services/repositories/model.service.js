'use strict';

import { unGetSelectData } from '../../utils/selectDataOptions.js';
import Object3DModel from '../../models/3DObject.model.js';

const findAll3DModels = async ({ limit, sortBy, filter, skip, unselect, page }) => {
    return await Object3DModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unselect))
        .lean();
};

export { findAll3DModels };
