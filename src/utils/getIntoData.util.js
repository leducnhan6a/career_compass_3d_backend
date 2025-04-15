'use strict';

import _ from 'lodash';

const getIntoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

export { getIntoData };