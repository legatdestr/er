window.EM = (typeof EM === 'object' ? EM : window.EM = {});

EM.isString = (entity) => {
    return Object.prototype.toString.call(entity) === '[object String]';
};