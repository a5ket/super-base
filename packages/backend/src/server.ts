import express, { Request, Response, NextFunction } from 'express'

import { sendInternalError } from './responses'
import heroesRouter from './routes/superheroes'
import imagesRouter from './routes/images'
import { UPLOAD_DIR } from './config'


export function createAppServer() {
    const server = express()

    server.use(express.json())

    server.use('/static', express.static(UPLOAD_DIR))

    server.use('/api/images', imagesRouter)
    server.use('/api/superheroes', heroesRouter)

    server.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
        console.error('Internal server error', error)
        sendInternalError(res)
    })

    return server
}