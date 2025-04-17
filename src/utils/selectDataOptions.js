'use strict';

// ['a', 'b', 'c'] => [['a', 1], ['b', 1], ['c', 1]] => fromEntries thì sẽ biến nó thành Object
// {a: 1, b: 1, c: 1}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((val) => [val, 1]));
};

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((val) => [val, 0]));
};

export { getSelectData, unGetSelectData };
