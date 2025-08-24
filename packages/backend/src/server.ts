import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { UPLOAD_DIR } from './config'
import { sendInternalError } from './responses'
import imagesRouter from './routes/images'
import heroesRouter from './routes/superheroes'


// Simple request logger middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString()
    const { method, originalUrl, ip } = req

    console.log(`[${timestamp}] ${method} ${originalUrl} - IP: ${ip}`)

    if ((method === 'POST' || method === 'PUT') &&
        req.headers['content-type'] &&
        !req.headers['content-type'].includes('multipart/form-data')) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2))
    }

    next()
}

export function createAppServer() {
    const server = express()

    server.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept'],
        credentials: false,
    }))

    server.use(express.json())

    // Add request logger middleware
    server.use(requestLogger)

    server.use('/static', express.static(UPLOAD_DIR))

    server.use('/api/images', imagesRouter)
    server.use('/api/superheroes', heroesRouter)

    server.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
        console.error('Internal server error', error)
        sendInternalError(res)
    })

    return server
}