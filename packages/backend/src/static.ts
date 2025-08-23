import fs from 'fs/promises'
import path from 'path'
import { BASE_URL, UPLOAD_DIR } from './config'
import { Image } from './types'

export const mimeTypeToExtension: Record<string, string> = {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp'
}

function getImageFilename(image: Image) {
    const extension = mimeTypeToExtension[image.mimeType] || 'bin'

    return `${image.id}.${extension}`
}


export async function saveImage(image: Image, imageData: Buffer) {
    const filename = getImageFilename(image)
    const filePath = path.join(UPLOAD_DIR, filename)

    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    await fs.writeFile(filePath, imageData)

    return filename
}

export function getImageUrl(image: Image) {
    const filename = getImageFilename(image)

    return `${BASE_URL}/static/${filename}`
}