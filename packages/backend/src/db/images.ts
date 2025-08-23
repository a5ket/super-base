import { ImageInput } from '../types'
import { eq } from 'drizzle-orm'
import { db } from './connection'
import * as schema from './schema'


export async function createImage({ mimeType }: ImageInput) {
    const [row] = await db
        .insert(schema.images)
        .values({ mimeType })
        .returning()

    return row
}


export async function deleteImage(imageId: string) {
    const result = await db
        .delete(schema.images)
        .where(eq(schema.images.id, imageId))
        .returning()

    return result.length > 0
}


export async function getImageById(imageId: string) {
    return db.query.images.findFirst({ where: eq(schema.images.id, imageId) })
}