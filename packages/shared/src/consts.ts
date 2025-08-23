export const superheroConstraints = {
    nickname: { min: 1, max: 100 },
    realName: { min: 1, max: 100 },
    originDescription: { min: 10, max: 2000 },
    superpowers: { min: 5, max: 1000 },
    catchPhrase: { min: 1, max: 500 },
    imageCaption: { max: 200 },
    imageUrl: { max: 500 }
} as const

export const pagination = {
    page: 1,
    limit: 5,
    maxLimit: 50
} as const

export const sortDefaults = {
    fields: ['nickname', 'realName', 'createdAt', 'updatedAt'] as const,
    orders: ['asc', 'desc'] as const,
    field: 'createdAt' as const,
    order: 'desc' as const
} as const

export const imageDefaults = {
    isPrimary: false
} as const

export const imageConstraints = {
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
} as const 