"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageConstraints = exports.imageDefaults = exports.sortDefaults = exports.pagination = exports.superheroConstraints = void 0;
exports.superheroConstraints = {
    nickname: { min: 1, max: 100 },
    realName: { min: 1, max: 100 },
    originDescription: { min: 10, max: 2000 },
    superpowers: { min: 5, max: 1000 },
    catchPhrase: { min: 1, max: 500 },
    imageCaption: { max: 200 },
    imageUrl: { max: 500 }
};
exports.pagination = {
    page: 1,
    limit: 5,
    maxLimit: 50
};
exports.sortDefaults = {
    fields: ['nickname', 'realName', 'createdAt', 'updatedAt'],
    orders: ['asc', 'desc'],
    field: 'createdAt',
    order: 'desc'
};
exports.imageDefaults = {
    isPrimary: false
};
exports.imageConstraints = {
    size: 5 * 1024 * 1024, // 5 MB
    width: {
        min: 100,
        max: 4000
    },
    height: {
        min: 100,
        max: 4000
    },
    mimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
};
