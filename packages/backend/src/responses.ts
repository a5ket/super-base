import { Response } from 'express'
import { PaginationData } from './types'


export function sendToken(res: Response, token: string) {
    return res
        .status(200)
        .json({ token })
}


export function sendData<T = unknown>(res: Response, data: T) {
    return res
        .status(200)
        .json({
            data
        })
}


export function sendPaginationData<T = unknown>(res: Response, data: T, pagination: PaginationData) {
    return res
        .status(200)
        .json({
            data,
            pagination
        })
}


export function sendNoContent(res: Response) {
    return res
        .status(204)
        .end()
}


export function sendError(res: Response, error: string, status: number = 500) {
    return res
        .status(status)
        .json({
            error
        })
}


export function sendErrorWithDetails(res: Response, error: string, details: object | string, status: number = 500) {
    return res
        .status(status)
        .json({
            error,
            details
        })
}


export function sendNotFoundError(res: Response, error: string = 'Not found') {
    return sendError(res, error, 404)
}


export function sendInternalError(res: Response) {
    return sendError(res, 'Internal server error', 500)
}


export function sendUniqueError(res: Response, errorMessage: string = 'Resource already exists') {
    return res
        .status(409)
        .json({ error: errorMessage })
}