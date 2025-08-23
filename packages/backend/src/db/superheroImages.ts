import { SuperheroImageInput, SuperheroImageUpdateInput } from '../types'
import { and, eq } from 'drizzle-orm'
import { db, Transaction } from './connection'
import * as schema from './schema'


export async function deleteSuperheroImage(imageId: string) {
    const result = await db
        .delete(schema.superheroImages)
        .where(eq(schema.superheroImages.id, imageId))
        .returning()

    return result.length > 0
}


async function unsetPrimarySuperheroImage(superheroId: string, tx: Transaction) {
    return tx
        .update(schema.superheroImages)
        .set({ isPrimary: false })
        .where(
            and(
                eq(schema.superheroImages.superheroId, superheroId),
                eq(schema.superheroImages.isPrimary, true)
            )
        )
}


export async function createSuperheroImage(superheroId: string, data: SuperheroImageInput) {
    return db.transaction(async (tx) => {
        if (data.isPrimary) {
            await unsetPrimarySuperheroImage(superheroId, tx)
        }

        const [row] = await tx
            .insert(schema.superheroImages)
            .values({ superheroId, ...data })
            .returning()

        return row
    })

}


async function createSuperheroImagesInTransaction(superheroId: string, images: SuperheroImageInput[], tx: Transaction) {
    const hasPrimary = images.some(image => image.isPrimary)

    if (hasPrimary) {
        await unsetPrimarySuperheroImage(superheroId, tx)
    }

    const data = images.map(image => ({ superheroId, ...image }))
    return await tx
        .insert(schema.superheroImages)
        .values(data)
        .returning()
}


export async function createSuperheroImages(superheroId: string, images: SuperheroImageInput[], tx?: Transaction) {
    if (!tx) {
        return db.transaction((tx) => createSuperheroImagesInTransaction(superheroId, images, tx))
    }

    return createSuperheroImagesInTransaction(superheroId, images, tx)
}


export async function updateSuperheroImage(superheroId: string, imageId: string, data: SuperheroImageUpdateInput) {
    return db.transaction(async (tx) => {
        if (data.isPrimary) {
            await unsetPrimarySuperheroImage(superheroId, tx)
        }

        const [row] = await tx
            .update(schema.superheroImages)
            .set(data)
            .where(eq(schema.superheroImages.id, imageId))
            .returning()


        return row
    })
}
