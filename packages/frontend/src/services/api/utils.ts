import { API_URL } from '@/config'

export interface ApiError {
    message: string
    status?: number
}

export const buildQueryString = (params: Record<string, any>): string => {
    const valid = Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    return valid.length ? `?${valid.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}` : ''
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`

    const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData
    const hasBody = options.body !== undefined

    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(isForm ? {} : hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers as Record<string, string> | undefined),
    }

    try {
        const res = await fetch(url, { ...options, headers })
        if (res.status === 204) return {} as T

        let data: any = null
        try { data = await res.json() } catch { data = null }

        if (!res.ok) {
            const message = (data && (data.error || data.message)) || `${res.status} ${res.statusText}`
            const err: ApiError = { message, status: res.status }
            throw err
        }

        if (data && typeof data === 'object') {
            if ('pagination' in data) return data as T
            if ('data' in data) return data.data as T
        }
        return data as T
    } catch (err: any) {
        if (err && typeof err === 'object' && 'status' in err) throw err as ApiError
        throw { message: err instanceof Error ? err.message : 'Network error' } as ApiError
    }
}

export const get = async <T>(endpoint: string) => apiRequest<T>(endpoint)
export const post = async <T>(endpoint: string, body: any) => apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) })
export const put = async <T>(endpoint: string, body: any) => apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) })
export const del = async <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' })
