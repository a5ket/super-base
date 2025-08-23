import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'


const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
}


const uuidPrimary = uuid('id').defaultRandom().primaryKey()


export const superheroes = pgTable('superheroes', {
    id: uuidPrimary,
    nickname: varchar('nickname', { length: 100 }).notNull(),
    realName: varchar('real_name', { length: 100 }).notNull(),
    originDescription: text('origin_description').notNull(),
    superpowers: text('superpowers').notNull(),
    catchPhrase: text('catch_phrase').notNull(),
    ...timestamps
})


export const superheroImages = pgTable('superhero_images', {
    id: uuidPrimary,
    superheroId: uuid('superhero_id').references(() => superheroes.id, { onDelete: 'cascade' }).notNull(),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    caption: varchar('caption', { length: 200 }),
    isPrimary: boolean('is_primary').default(false).notNull(),
    ...timestamps
})


export const superheroRelations = relations(superheroes, ({ many }) => ({
    images: many(superheroImages)
}))


export const supeheroImagesRelations = relations(superheroImages, ({ one }) => ({
    superhero: one(superheroes, {
        fields: [superheroImages.superheroId],
        references: [superheroes.id]
    })
}))


export const images = pgTable('images', {
    id: uuidPrimary,
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    ...timestamps
})