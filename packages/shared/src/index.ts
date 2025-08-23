export * from './consts'

export interface SuperheroImageInput {
  imageUrl: string
  caption?: string | null
  isPrimary?: boolean
}

export interface SuperheroImageUpdateInput extends Partial<SuperheroImageInput> {
  caption?: string
}

export interface SuperheroInput {
  nickname: string
  realName: string
  originDescription: string
  superpowers: string
  catchPhrase: string
  images: SuperheroImageInput[]
}

export interface SuperheroUpdateInput extends Partial<SuperheroInput> { }


export interface Superhero extends SuperheroInput {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface SuperheroImage extends SuperheroImageInput {
  superheroId: Superhero['id']
  id: string
  caption: string
  isPrimary: boolean
  createdAt: Date
  updatedAt: Date
}


export interface SuperheroWithImages extends Superhero {
  images: SuperheroImage[]
}


export interface SuperheroListItem extends Superhero {
  primaryImage?: SuperheroImage
}


export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}


export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationData
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string,
    code?: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SuperheroesPaginationParams extends PaginationParams {
  sortBy?: 'nickname' | 'realName' | 'createdAt' | 'updatedAt'
}