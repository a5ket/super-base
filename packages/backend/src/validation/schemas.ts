import { imageConstraints, imageDefaults, pagination, sortDefaults, superheroConstraints } from 'shared'
import { z } from 'zod'


const nonEmptyString = (minLength = 1, maxLength = 255) =>
    z.string()
        .trim()
        .min(minLength)
        .max(maxLength)


export const superheroImageSchema = z.object({
    imageUrl: z.url(),
    caption: z.string().trim().optional(),
    isPrimary: z.boolean().default(imageDefaults.isPrimary)
})


export const superheroSchema = z.object({
    nickname: nonEmptyString(superheroConstraints.nickname.min, superheroConstraints.nickname.max),
    realName: nonEmptyString(superheroConstraints.realName.min, superheroConstraints.realName.max),
    originDescription: nonEmptyString(superheroConstraints.originDescription.min, superheroConstraints.originDescription.max),
    superpowers: nonEmptyString(superheroConstraints.superpowers.min, superheroConstraints.superpowers.max),
    catchPhrase: nonEmptyString(superheroConstraints.catchPhrase.min, superheroConstraints.catchPhrase.max),
    images: z.array(superheroImageSchema)
        .refine(
            (images) => images.filter(img => img.isPrimary).length <= 1,
            { message: "Only one primary image is allowed" }
        )
})


export const superheroUpdateInputSchema = superheroSchema.omit({ images: true }).partial()


export const superheroesPaginationParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(pagination.page),
    limit: z.coerce.number().int().positive().max(pagination.maxLimit).default(pagination.limit),
    search: z.string().trim().optional(),
    sortBy: z.enum(sortDefaults.fields).default(sortDefaults.field),
    sortOrder: z.enum(sortDefaults.orders).default(sortDefaults.order)
})


export const superheroParamsSchema = z.object({
    superheroId: z.uuid()
})


export const superheroImageParamsSchema = superheroParamsSchema.extend({
    imageId: z.uuid()
})


export const imageSchema = z.object({
    size: z.number()
        .max(imageConstraints.size, { message: `Image size must be ≤ ${imageConstraints.size} bytes` }),
    width: z.number()
        .min(imageConstraints.width.min, { message: `Image width must be ≥ ${imageConstraints.width.min}px` })
        .max(imageConstraints.width.max, { message: `Image width must be ≤ ${imageConstraints.width.max}px` }),
    height: z.number()
        .min(imageConstraints.height.min, { message: `Image height must be ≥ ${imageConstraints.height.min}px` })
        .max(imageConstraints.height.max, { message: `Image height must be ≤ ${imageConstraints.height.max}px` }),
    mimeType: z.enum(imageConstraints.mimeTypes, { message: `Image mime type must be one of: ${imageConstraints.mimeTypes.join(', ')}` })
})


export const imageParamsSchema = z.object({
    imageId: z.uuid()
})