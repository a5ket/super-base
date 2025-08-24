import { apiRequest } from './utils'

export interface UploadedImage {
    id: string
    url: string
    createdAt: string
}

export const imagesApi = {
    upload: async (file: File): Promise<UploadedImage> => {
        const form = new FormData()
        form.append('image', file, file.name)

        return apiRequest<UploadedImage>('/images', {
            method: 'POST',
            body: form,
            headers: {}
        })
    },

    delete: async (imageId: string): Promise<void> => {
        return apiRequest<void>(`/images/${imageId}`, {
            method: 'DELETE'
        })
    }
}