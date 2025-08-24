import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { SuperheroImageInput, SuperheroUpdateInput, SuperheroWithImages } from 'shared'
import { SuperheroForm } from '../components/superhero/SuperheroForm'
import { superheroesApi } from '../services/api/superheroes'
import styles from '../styles/pagestyles.module.css'

export default function EditSuperheroPage() {
    const { superheroId } = useParams<{ superheroId: string }>()
    const navigate = useNavigate()
    const [superhero, setSuperhero] = useState<SuperheroWithImages | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>()

    useEffect(() => {
        async function fetchSuperhero() {
            if (!superheroId) {
                setError('Superhero ID is missing')
                setIsLoading(false)
                return
            }

            try {
                const data = await superheroesApi.getById(superheroId)
                setSuperhero(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load superhero data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchSuperhero()
    }, [superheroId])

    const handleSubmit = async (formData: FormData) => {
        if (!superheroId) {
            setError('Superhero ID is missing')
            return
        }

        setIsSubmitting(true)
        setError(undefined)

        try {
            const updatePayload: SuperheroUpdateInput = {
                nickname: String(formData.get('nickname') || ''),
                realName: String(formData.get('realName') || ''),
                originDescription: String(formData.get('originDescription') || ''),
                superpowers: String(formData.get('superpowers') || ''),
                catchPhrase: String(formData.get('catchPhrase') || ''),
            }

            await superheroesApi.update(superheroId, updatePayload)

            await processImages(formData, superheroId)

            navigate(`/superheroes/${superheroId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update superhero. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const processImages = async (formData: FormData, heroId: string) => {
        const imageGroups = parseImageFormData(formData)

        const { toDelete, toUpdate, toAdd } = categorizeImages(imageGroups)

        await Promise.all(toDelete.map(imageId => superheroesApi.deleteImage(heroId, imageId)))

        for (const op of toUpdate.filter(op => !op.data.isPrimary)) {
            await superheroesApi.updateImage(heroId, op.id, op.data)
        }
        for (const data of toAdd.filter(data => !data.isPrimary)) {
            await superheroesApi.addImage(heroId, data)
        }

        for (const op of toUpdate.filter(op => op.data.isPrimary)) {
            await superheroesApi.updateImage(heroId, op.id, op.data)
        }
        for (const data of toAdd.filter(data => data.isPrimary)) {
            await superheroesApi.addImage(heroId, data)
        }
    }

    const parseImageFormData = (formData: FormData) => {
        const imageGroups: Record<string, Record<string, any>> = {}

        for (const [key, value] of formData.entries()) {
            const match = key.match(/^images\[(\d+)\]\[(\w+)\]$/)
            if (match) {
                const [, idx, prop] = match
                imageGroups[idx] = imageGroups[idx] || {}
                imageGroups[idx][prop] = value
            }
        }

        return imageGroups
    }

    const categorizeImages = (imageGroups: Record<string, Record<string, any>>) => {
        const toDelete: string[] = []
        const toUpdate: Array<{ id: string; data: SuperheroImageInput }> = []
        const toAdd: SuperheroImageInput[] = []

        const indices = Object.keys(imageGroups).sort((a, b) => Number(a) - Number(b))

        for (const idx of indices) {
            const item = imageGroups[idx]
            const isRemoved = item.isRemoved === 'true'
            const idStr = typeof item.id === 'string' ? item.id : undefined

            if (isRemoved && idStr) {
                toDelete.push(idStr)
                continue
            }
            if (isRemoved) continue

            const data: SuperheroImageInput = {
                imageUrl: String(item.imageUrl || ''),
                caption: typeof item.caption === 'string' ? item.caption : undefined,
                isPrimary: String(item.isPrimary) === 'true'
            }

            if (idStr) toUpdate.push({ id: idStr, data })
            else toAdd.push(data)
        }

        return { toDelete, toUpdate, toAdd }
    }

    const handleCancel = () => {
        navigate(superheroId ? `/superheroes/${superheroId}` : '/superheroes')
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading superhero data...</div>
            </div>
        )
    }

    if (error && !superhero) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/superheroes')} className={styles.backbutton}>
                        Back to Superheroes
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Superhero: {superhero?.nickname}</h1>
            {superhero && (
                <SuperheroForm
                    initialData={superhero}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            )}
        </div>
    )
}