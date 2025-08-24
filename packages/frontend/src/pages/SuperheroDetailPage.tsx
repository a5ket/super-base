import ImageViewerModal from '@/components/common/ImageViewerModal'
import { superheroesApi } from '@/services/api/superheroes'
import pageStyles from '@/styles/pagestyles.module.css'
import gridStyles from '@/styles/superheroForm.module.css'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { SuperheroWithImages } from 'shared'

export default function SuperheroDetailPage() {
    const { superheroId } = useParams()
    const [hero, setHero] = useState<SuperheroWithImages | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    const [viewerOpen, setViewerOpen] = useState(false)
    const [viewerIndex, setViewerIndex] = useState<number | null>(null)

    useEffect(() => {
        const load = async () => {
            if (!superheroId) return
            try {
                setLoading(true)
                const data = await superheroesApi.getById(superheroId)
                setHero(data)
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Failed to load superhero'
                setError(msg)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [superheroId])

    const openViewer = (index: number) => {
        setViewerIndex(index)
        setViewerOpen(true)
    }

    if (loading) return <div className={pageStyles.loading}>Loading...</div>
    if (error) return <div className={pageStyles.error}>{error}</div>
    if (!hero) return <div className={pageStyles.error}>Superhero not found</div>

    return (
        <div className={pageStyles.container}>
            <div className={pageStyles.row}>
                <h1>{hero.nickname}</h1>
                <Link to={`/superheroes/${hero.id}/edit`}>
                    <button>Edit</button>
                </Link>
            </div>

            <div className={pageStyles.infoContainer}>
                <div><strong>Real Name:</strong> {hero.realName}</div>
                <div className={pageStyles.infoSection}>
                    <strong>Origin Description:</strong>
                    <div>{hero.originDescription}</div>
                </div>
                <div className={pageStyles.infoSection}>
                    <strong>Superpowers:</strong>
                    <div>{hero.superpowers}</div>
                </div>
                <div className={pageStyles.infoSection}>
                    <strong>Catch Phrase:</strong>
                    <div>{hero.catchPhrase}</div>
                </div>
            </div>

            {hero.images && hero.images.length > 0 && (
                <div>
                    <h2>Images</h2>
                    <div className={gridStyles.imagegrid}>
                        {hero.images.map((img, idx) => (
                            <div key={img.id} className={gridStyles.imageitem}>
                                <div
                                    className={`${gridStyles.imagepreview} ${gridStyles.clickable}`}
                                    onClick={() => openViewer(idx)}
                                    role="button"
                                    aria-label="Open image"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openViewer(idx) }}
                                >
                                    <img src={img.imageUrl} alt={img.caption || `Image ${idx + 1}`} />
                                    {img.isPrimary && <span className={gridStyles.primarybadge}>Primary</span>}
                                </div>
                                {img.caption && <div className={gridStyles.imagecaption}>{img.caption}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ImageViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                src={viewerIndex !== null ? hero.images[viewerIndex]?.imageUrl : ''}
                caption={viewerIndex !== null ? hero.images[viewerIndex]?.caption : undefined}
            />
        </div>
    )
}