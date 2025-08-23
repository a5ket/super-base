import { APP_PORT } from './config'
import { createAppServer } from './server'


async function main() {
    const app = createAppServer()

    const server = app.listen(APP_PORT, (error) => {
        if (error) {
            console.error('Error starting server:', error)
            return
        }

        console.info('Server is listening on', server.address())
    })
}


main()