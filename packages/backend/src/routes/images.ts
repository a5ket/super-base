import express from 'express'
import multer from 'multer'
import { imageConstraints } from 'shared'
import { createImage, deleteImage, getImageById } from '../db/images'
import { sendData, sendError, sendErrorWithDetails, sendNoContent, sendNotFoundError } from '../responses'
import { getImageUrl, saveImage } from '../static'
import { validateImage } from '../validation/files'
import { validateParams } from '../validation/middlewares'
import { imageParamsSchema } from '../validation/schemas'


const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: imageConstraints.size } })
const router = express.Router()


router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return sendError(res, 'No image uploaded', 400)
    }

    let mimeType: string

    try {
        const imageMetadata = await validateImage(req.file)
        mimeType = imageMetadata.mimeType
    } catch (error) {
        console.error('Error validating the image', error)
        if (!(error instanceof Error)) {
            throw error
        }

        return sendErrorWithDetails(res, 'Error validating the image', error.message, 400)
    }

    const createdImage = await createImage({ mimeType })
    let imageFilename: string

    try {
        imageFilename = await saveImage(createdImage, req.file.buffer)

        return sendData(res, {
            id: createdImage.id,
            url: getImageUrl(createdImage),
            createdAt: createdImage.createdAt
        })
    } catch (error) {
        console.error('Error saving the image', error)

        await deleteImage(createdImage.id)
        return sendError(res, 'Error saving the image')
    }
})


router.get('/:imageId', validateParams(imageParamsSchema), async (req, res) => {
    const imageId = req.validatedParams.imageId
    const image = await getImageById(imageId)

    if (!image) {
        return sendNotFoundError(res, 'Image not found')
    }

    const imageUrl = getImageUrl(image)

    return sendData(res, {
        id: image.id,
        url: imageUrl,
        createdAt: image.createdAt
    })
})


router.delete('/:imageId', validateParams(imageParamsSchema), async (req, res) => {
    const imageId = req.validatedParams.imageId
    const isDeleted = await deleteImage(imageId)

    if (!isDeleted) {
        return sendNotFoundError(res, 'Image not found')
    }

    return sendNoContent(res)
})


export default router