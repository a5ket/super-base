import FormField from '@components/common/FormField'
import styles from '@styles/superheroForm.module.css'
import { useState, type FormEvent } from 'react'
import type { SuperheroWithImages } from 'shared'
import ImageGallery, { type ImageItem } from './ImageGallery'
import ImageUploadModal from './ImageUploadModal'

interface SuperheroFormProps {
    initialData?: SuperheroWithImages
    onSubmit: (formData: FormData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
    error?: string
}

export function SuperheroForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    error
}: SuperheroFormProps) {
    const [nickname, setNickname] = useState(initialData?.nickname || '')
    const [realName, setRealName] = useState(initialData?.realName || '')
    const [originDescription, setOriginDescription] = useState(initialData?.originDescription || '')
    const [superpowers, setSuperpowers] = useState(initialData?.superpowers || '')
    const [catchPhrase, setCatchPhrase] = useState(initialData?.catchPhrase || '')
    const [images, setImages] = useState<ImageItem[]>(
        initialData?.images?.map(img => ({
            id: img.id,
            url: img.imageUrl,
            caption: img.caption || '',
            isPrimary: img.isPrimary || false
        })) || []
    )
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAddImage = (url: string) => {
        setImages(prev => {
            const hasVisible = prev.some(img => !img.isRemoved)
            return [
                ...prev,
                {
                    url,
                    caption: '',
                    isPrimary: !hasVisible,
                    isNew: true
                }
            ]
        })
    }

    const handleCaptionChange = (index: number, caption: string) => {
        setImages(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], caption }
            return updated
        })
    }

    const handleSetPrimary = (index: number) => {
        setImages(prev => {
            return prev.map((img, i) => ({
                ...img,
                isPrimary: i === index
            }))
        })
    }

    const handleRemoveImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev]
            const image = updated[index]

            if (image.isNew) {
                updated.splice(index, 1)
            } else {
                updated[index] = { ...image, isRemoved: true }
            }

            if (image.isPrimary && updated.some(img => !img.isRemoved)) {
                const newPrimaryIndex = updated.findIndex(img => !img.isRemoved)
                if (newPrimaryIndex >= 0) {
                    updated[newPrimaryIndex] = { ...updated[newPrimaryIndex], isPrimary: true }
                }
            }

            return updated
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('nickname', nickname)
        formData.append('realName', realName)
        formData.append('originDescription', originDescription)
        formData.append('superpowers', superpowers)
        formData.append('catchPhrase', catchPhrase)

        const visibleImages = images.filter(img => !img.isRemoved)

        if (visibleImages.length > 0) {
            const primaryImageIndex = visibleImages.findIndex(img => img.isPrimary)
            if (primaryImageIndex === -1) {
                visibleImages[0].isPrimary = true
            }
        }

        images.forEach((image, index) => {
            if (image.isRemoved && image.id) {
                formData.append(`images[${index}][id]`, image.id)
                formData.append(`images[${index}][isRemoved]`, 'true')
            } else if (!image.isRemoved) {
                if (image.id) {
                    formData.append(`images[${index}][id]`, image.id)
                }
                formData.append(`images[${index}][caption]`, image.caption)
                formData.append(`images[${index}][isPrimary]`, image.isPrimary ? 'true' : 'false')
                formData.append(`images[${index}][imageUrl]`, image.url)
            }
        })

        await onSubmit(formData)
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <FormField
                id="nickname"
                label="Nickname"
                value={nickname}
                onChange={setNickname}
                required
            />

            <FormField
                id="realName"
                label="Real Name"
                value={realName}
                onChange={setRealName}
                required
            />

            <FormField
                id="originDescription"
                label="Origin Description"
                value={originDescription}
                onChange={setOriginDescription}
                type="textarea"
                required
            />

            <FormField
                id="superpowers"
                label="Superpowers"
                value={superpowers}
                onChange={setSuperpowers}
                type="textarea"
                required
            />

            <FormField
                id="catchPhrase"
                label="Catch Phrase"
                value={catchPhrase}
                onChange={setCatchPhrase}
                required
            />

            <div className={styles.formgroup}>
                <label className={styles.label}>Images</label>
                <button type="button" className={styles.primarybutton} onClick={() => setIsModalOpen(true)}>
                    Add Image
                </button>
                <p className={styles.helptext}>Add images by uploading a file or pasting a URL. The first visible image will be set as primary by default.</p>

                <ImageGallery
                    images={images.filter(img => !img.isRemoved)}
                    onCaptionChange={handleCaptionChange}
                    onSetPrimary={handleSetPrimary}
                    onRemoveImage={handleRemoveImage}
                />
            </div>

            <div className={styles.formactions}>
                <button
                    type="button"
                    className={styles.cancelbutton}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={styles.submitbutton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : initialData ? 'Update Superhero' : 'Create Superhero'}
                </button>
            </div>

            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(url) => handleAddImage(url)}
            />
        </form>
    )
}