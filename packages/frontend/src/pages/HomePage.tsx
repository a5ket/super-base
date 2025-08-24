import styles from '@styles/pagestyles.module.css'
import { Link } from 'react-router'

export default function HomePage() {
    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>Welcome to Superhero Database</h1>
                <p className={styles.subtitle}>
                    Explore the universe of superheroes, their powers, and stories
                </p>

                <div className={styles.buttonContainer}>
                    <Link to="/superheroes" className={styles.primaryButton}>
                        View All Superheroes
                    </Link>
                </div>
            </div>

            <div className={styles.featuresContainer}>
                <div className={styles.featureCard}>
                    <h2>Browse Heroes</h2>
                    <p>Discover superheroes from across the multiverse</p>
                </div>

                <div className={styles.featureCard}>
                    <h2>Create New</h2>
                    <p>Add your own superhero to the database</p>
                    <Link to="/superheroes/create" className={styles.secondaryButton}>
                        Create Hero
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <h2>Manage Collection</h2>
                    <p>Edit and organize your superhero roster</p>
                </div>
            </div>
        </div>
    )
}