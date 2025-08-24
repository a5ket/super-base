import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { SuperheroInput } from 'shared'
import { SuperheroForm } from '../components/superhero/SuperheroForm'
import { imagesApi } from '../services/api/images'
import { superheroesApi } from '../services/api/superheroes'
import styles from '../styles/pagestyles.module.css'

export default function CreateSuperheroPage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>()

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(undefined)

        try {
            const nickname = String(formData.get('nickname') || '')
            const realName = String(formData.get('realName') || '')
            const originDescription = String(formData.get('originDescription') || '')
            const superpowers = String(formData.get('superpowers') || '')
            const catchPhrase = String(formData.get('catchPhrase') || '')

            const imageGroups: Record<string, Record<string, any>> = {}
            for (const [key, value] of formData.entries()) {
                const match = key.match(/^images\[(\d+)\]\[(\w+)\]$/)
                if (match) {
                    const [, idx, prop] = match
                    imageGroups[idx] = imageGroups[idx] || {}
                    imageGroups[idx][prop] = value
                }
            }

            const images: SuperheroInput['images'] = []
            const indices = Object.keys(imageGroups).sort((a, b) => Number(a) - Number(b))
            for (const idx of indices) {
                const item = imageGroups[idx]
                if (item.isRemoved === 'true') continue

                let url: string | undefined
                if (item.file instanceof File && item.file.size > 0) {
                    const uploaded = await imagesApi.upload(item.file)
                    url = uploaded.url
                } else if (typeof item.imageUrl === 'string') {
                    url = item.imageUrl
                }

                if (!url) continue

                images.push({
                    imageUrl: url,
                    caption: typeof item.caption === 'string' ? item.caption : undefined,
                    isPrimary: String(item.isPrimary) === 'true'
                })
            }

            const payload: SuperheroInput = {
                nickname,
                realName,
                originDescription,
                superpowers,
                catchPhrase,
                images
            }

            await superheroesApi.create(payload)
            navigate('/superheroes')
        } catch (err) {
            console.error('Failed to create superhero:', err)
            setError(err instanceof Error ? err.message : 'Failed to create superhero. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate('/superheroes')
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Superhero</h1>
            <SuperheroForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                error={error}
            />
        </div>
    )
}