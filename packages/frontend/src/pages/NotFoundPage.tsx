import { Link } from 'react-router'
import styles from '../styles/notFoundPage.module.css'

export default function NotFoundPage() {
    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Page Not Found</h2>
                <p className={styles.message}>
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className={styles.homeLink}>
                    Back to Home
                </Link>
            </div>
        </main>
    )
}