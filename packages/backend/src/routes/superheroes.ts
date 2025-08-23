import { createSuperhero, deleteSuperheroById, getSuperheroById, querySuperheroes, updateSuperheroById } from '../db/superheroes'
import { createSuperheroImage, deleteSuperheroImage, updateSuperheroImage } from '../db/superheroImages'
import { sendData, sendNoContent, sendNotFoundError, sendPaginationData } from '../responses'
import { validateBody, validateParams, validateQuery } from '../validation/middlewares'
import { superheroesPaginationParamsSchema, superheroImageParamsSchema, superheroImageSchema, superheroParamsSchema, superheroSchema, superheroUpdateInputSchema } from '../validation/schemas'
import express from 'express'


const router = express.Router()


router.get('/', validateQuery(superheroesPaginationParamsSchema), async (req, res) => {
    const paginationParams = req.validatedQuery
    const { items, pagination } = await querySuperheroes(paginationParams)

    return sendPaginationData(res, items, pagination)
})

router.post('/', validateBody(superheroSchema), async (req, res) => {
    const data = req.validatedBody
    const createdSuperhero = await createSuperhero(data)

    return sendData(res, createdSuperhero)
})

router.get('/:superheroId', validateParams(superheroParamsSchema), async (req, res) => {
    const superheroId = req.validatedParams.superheroId
    const superhero = await getSuperheroById(superheroId)

    if (superhero) {
        return sendNotFoundError(res, 'Superhero not found')
    }

    return sendData(res, superhero)
})

router.put('/:superheroId', validateParams(superheroParamsSchema), validateBody(superheroUpdateInputSchema), async (req, res) => {
    const superheroId = req.validatedParams.superheroId
    const data = req.validatedBody
    const updatedSuperhero = await updateSuperheroById(superheroId, data)

    if (!updatedSuperhero) {
        return sendNotFoundError(res, 'Superhero not found')
    }

    return sendData(res, updatedSuperhero)
})

router.delete('/:superheroId', validateParams(superheroParamsSchema), async (req, res) => {
    const superheroId = req.validatedParams.superheroId
    const isDeleted = await deleteSuperheroById(superheroId)

    if (!isDeleted) {
        return sendNotFoundError(res, 'Superhero not found')
    }

    return sendNoContent(res)
})

router.post('/:superheroId/images', validateParams(superheroParamsSchema), validateBody(superheroImageSchema), async (req, res) => {
    const superheroId = req.validatedParams.superheroId
    const superhero = await getSuperheroById(superheroId)

    if (!superhero) {
        return sendNotFoundError(res, 'Superhero not found')
    }

    const data = req.validatedBody
    const createdSuperheroImage = await createSuperheroImage(superheroId, data)

    return sendData(res, createdSuperheroImage)
})

router.put('/:superheroId/images/:imageId', validateParams(superheroImageParamsSchema), validateBody(superheroImageSchema), async (req, res) => {
    const { superheroId, imageId } = req.validatedParams.imageId
    const data = req.validatedBody
    const updatedSuperheroImage = await updateSuperheroImage(superheroId, imageId, data)

    if (!updatedSuperheroImage) {
        return sendNotFoundError(res, 'Superhero image not found')
    }

    return sendData(res, updatedSuperheroImage)
})

router.delete('/:superheroId/images/:imageId', validateParams(superheroImageParamsSchema), async (req, res) => {
    const imageId = req.validatedParams.imageId
    const isDeleted = await deleteSuperheroImage(imageId)

    if (!isDeleted) {
        return sendNotFoundError(res, 'Image not found')
    }

    return sendNoContent(res)
})


export default router