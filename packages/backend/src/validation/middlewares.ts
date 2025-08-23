import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'


declare global {
    namespace Express {
        interface Request {
            validatedBody: any
            validatedQuery: any
            validatedParams: any
        }
    }
}

function handleValidationError(error: unknown, res: Response, next: NextFunction, message: string) {
    if (error instanceof z.ZodError) {
        res.status(400).json({
            success: false,
            error: {
                message,
                details: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            }
        })
    } else {
        next(error)
    }
}

export function validateBody<T>(schema: z.ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse and store in validatedBody, preserving original req.body
            req.validatedBody = schema.parse(req.body)
            next()
        } catch (error) {
            handleValidationError(error, res, next, 'Validation failed')
        }
    }
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse and store in validatedQuery, preserving original req.query
            req.validatedQuery = schema.parse(req.query)
            next()
        } catch (error) {
            handleValidationError(error, res, next, 'Invalid query parameters')
        }
    }
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse and store in validatedParams, preserving original req.params
            req.validatedParams = schema.parse(req.params)
            next()
        } catch (error) {
            handleValidationError(error, res, next, 'Invalid parameters')
        }
    }
}