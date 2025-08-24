import { Superhero, SuperheroInput, SuperheroUpdateInput, SuperheroesPaginationParamsInput } from '../types'
import { asc, count, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from './connection'
import * as schema from './schema'
import { createSuperheroImages } from './superheroImages'


export async function createSuperhero({ nickname, realName, originDescription, superpowers, catchPhrase, images }: SuperheroInput): Promise<Superhero> {
    return db.transaction(async (tx) => {
        const [createdSuperhero] = await tx
            .insert(schema.superheroes)
            .values({
                nickname,
                realName,
                originDescription,
                superpowers,
                catchPhrase
            })
            .returning()

        if (images.length < 1) {
            return {
                ...createdSuperhero,
                images: []
            }
        }

        const createdImages = await createSuperheroImages(createdSuperhero.id, images, tx)

        return {
            ...createdSuperhero,
            images: createdImages
        }
    })
}

export async function getSuperheroById(superheroId: string) {
    return db.query.superheroes.findFirst({
        where: eq(schema.superheroes.id, superheroId),
        with: { images: true }
    })
}

export async function querySuperheroes(params: SuperheroesPaginationParamsInput) {
    return await db.transaction(async (tx) => {
        const whereConditions = params.search
            ? or(
                ilike(schema.superheroes.nickname, `%${params.search}%`),
                ilike(schema.superheroes.realName, `%${params.search}%`)
            )
            : undefined

        const orderBy = params.sortOrder === 'asc'
            ? asc(schema.superheroes[params.sortBy])
            : desc(schema.superheroes[params.sortBy])

        const itemsQuery = tx.query.superheroes.findMany({
            where: whereConditions,
            orderBy,
            limit: params.limit,
            offset: (params.page - 1) * params.limit,
            with: {
                images: {
                    where: eq(schema.superheroImages.isPrimary, true),
                    limit: 1
                }
            }
        })
        const totalQuery = tx.select({ value: count() }).from(schema.superheroes).where(whereConditions)
        const [items, [{ value: total }]] = await Promise.all([itemsQuery, totalQuery])
        const totalPages = Math.ceil(total / params.limit)

        return {
            items: items.map(superhero => ({
                ...superhero,
                primaryImage: superhero.images[0] || undefined,
                images: undefined
            })),
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages,
                hasNextPage: params.page < totalPages,
                hasPrevPage: params.page > 1,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder
            }
        }
    })
}

export async function updateSuperheroById(superheroId: string, data: SuperheroUpdateInput) {
    const [row] = await db
        .update(schema.superheroes)
        .set({
            ...data
        })
        .where(eq(schema.superheroes.id, superheroId))
        .returning()

    return row
}

export async function deleteSuperheroById(superheroId: string) {
    const result = await db
        .delete(schema.superheroes)
        .where(eq(schema.superheroes.id, superheroId))
        .returning()

    return result.length > 0
}