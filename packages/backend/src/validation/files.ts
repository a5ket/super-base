import sharp from 'sharp'
import { imageSchema } from './schemas'


export async function validateImage(file: Express.Multer.File) {
    const image = sharp(file.buffer)
    const metadata = await image.metadata()

    const parseResult = imageSchema.safeParse({
        size: file.size,
        width: metadata.width,
        height: metadata.height,
        mimeType: file.mimetype
    })

    if (!parseResult.success) {
        throw new Error(parseResult.error.issues[0].message)
    }

    return {
        mimeType: file.mimetype,
        width: metadata.width,
        height: metadata.height
    }
}