import type { PaginatedResponse, SuperheroesPaginationParams, SuperheroImageInput, SuperheroInput, SuperheroListItem, SuperheroUpdateInput, SuperheroWithImages } from 'shared'
import { apiRequest, buildQueryString } from './utils'


export const superheroesApi = {
    getList: async (params: SuperheroesPaginationParams = {}): Promise<PaginatedResponse<SuperheroListItem>> => {
        const queryString = buildQueryString({
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder
        })

        return apiRequest<PaginatedResponse<SuperheroListItem>>(`/superheroes${queryString}`)
    },

    getById: async (id: string): Promise<SuperheroWithImages> => {
        return apiRequest<SuperheroWithImages>(`/superheroes/${id}`)
    },

    create: async (data: SuperheroInput): Promise<SuperheroWithImages> => {
        return apiRequest<SuperheroWithImages>('/superheroes', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
    },

    update: async (id: string, data: SuperheroUpdateInput): Promise<SuperheroWithImages> => {
        return apiRequest<SuperheroWithImages>(`/superheroes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
    },

    delete: async (id: string): Promise<void> => {
        return apiRequest<void>(`/superheroes/${id}`, {
            method: 'DELETE'
        })
    },

    addImage: async (id: string, image: SuperheroImageInput) => {
        return apiRequest(`/superheroes/${id}/images`, {
            method: 'POST',
            body: JSON.stringify(image),
            headers: { 'Content-Type': 'application/json' }
        })
    },

    updateImage: async (id: string, imageId: string, image: SuperheroImageInput) => {
        return apiRequest(`/superheroes/${id}/images/${imageId}`, {
            method: 'PUT',
            body: JSON.stringify(image),
            headers: { 'Content-Type': 'application/json' }
        })
    },

    deleteImage: async (id: string, imageId: string) => {
        return apiRequest<void>(`/superheroes/${id}/images/${imageId}`, {
            method: 'DELETE'
        })
    }
}