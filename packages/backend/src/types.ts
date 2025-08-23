export type {
    PaginationData,
    SuperheroesPaginationParams, 
    SuperheroImageInput, 
    SuperheroInput, 
    SuperheroListItem, 
    SuperheroUpdateInput,
    SuperheroImageUpdateInput,
    Superhero
} from 'shared'
import type { SuperheroesPaginationParams } from 'shared'


export interface SuperheroesPaginationParamsInput extends Required<SuperheroesPaginationParams> { }

export interface ImageInput {
    mimeType: string
}


export interface Image {
    id: string
    mimeType: string
}