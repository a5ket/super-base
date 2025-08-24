import styles from '@styles/superheroesPage.module.css'
import { Link } from 'react-router'
import type { SuperheroListItem } from 'shared'

interface SuperheroCardProps {
    hero: SuperheroListItem
}

export default function SuperheroCard({ hero }: SuperheroCardProps) {
    return (
        <Link to={`/superheroes/${hero.id}`} className={styles.card}>
            <div className={styles.cardImageContainer}>
                {hero.primaryImage ? (
                    <img
                        src={hero.primaryImage.imageUrl}
                        alt={hero.nickname}
                        className={styles.cardImage}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <span>{hero.nickname.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{hero.nickname}</h2>
            </div>
        </Link>
    )
}
