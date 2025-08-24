import SuperheroCard from '@/components/superhero/SuperheroCard'
import Pagination from '@components/common/Pagination'
import styles from '@styles/superheroesPage.module.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { SuperheroListItem } from 'shared'
import { superheroesApi } from '../services/api/superheroes'
import pageStyles from '../styles/pagestyles.module.css'

export default function SuperheroesPage() {
    const [superheroes, setSuperheroes] = useState<SuperheroListItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        fetchSuperheroes()
    }, [currentPage])

    const fetchSuperheroes = async (): Promise<void> => {
        try {
            setLoading(true)
            const result = await superheroesApi.getList({ page: currentPage, limit: 5 })
            setSuperheroes(result.data)
            setTotalPages(result.pagination.totalPages)
            setLoading(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch superheroes'
            setError(message)
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    if (loading) {
        return <div className={pageStyles.loading}>Loading superheroes...</div>
    }

    if (error) {
        return (
            <div className={pageStyles.container}>
                <div className={pageStyles.error}>{error}</div>
            </div>
        )
    }

    return (
        <div className={styles.fullWidthContainer}>
            <div className={styles.superheroesContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Superheroes</h1>
                    <Link to="/superheroes/create">
                        <button className={styles.addButton}>Add New Superhero</button>
                    </Link>
                </div>

                {superheroes.length > 0 ? (
                    <>
                        <div className={styles.cardGrid}>
                            {superheroes.map((hero) => (
                                <SuperheroCard key={hero.id} hero={hero} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className={styles.noResults}>No superheroes found. Create one!</div>
                )}
            </div>
        </div>
    )
}