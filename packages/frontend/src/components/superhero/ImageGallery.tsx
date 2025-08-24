import ImageViewerModal from '@components/common/ImageViewerModal'
import styles from '@styles/formComponents.module.css'
import { useEffect, useState } from 'react'

export interface ImageItem {
    id?: string
    url: string
    caption: string
    isPrimary: boolean
    isNew?: boolean
    isRemoved?: boolean
}

interface ImageGalleryProps {
    images: ImageItem[]
    onCaptionChange: (index: number, caption: string) => void
    onSetPrimary: (index: number) => void
    onRemoveImage: (index: number) => void
}

export default function ImageGallery({
    images,
    onCaptionChange,
    onSetPrimary,
    onRemoveImage
}: ImageGalleryProps) {
    const [viewerOpen, setViewerOpen] = useState(false)
    const [viewerIndex, setViewerIndex] = useState<number | null>(null)
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

    useEffect(() => {
        setImageErrors({})
    }, [images])

    const openViewer = (index: number) => {
        if (!imageErrors[index]) {
            setViewerIndex(index)
            setViewerOpen(true)
        }
    }

    const handleImageError = (index: number) => {
        setImageErrors(prev => ({
            ...prev,
            [index]: true
        }))
    }

    if (images.length === 0) {
        return <p className={styles.noImages}>No images added yet</p>
    }

    return (
        <>
            <div className={styles.imageGrid} role="list" aria-label="Image gallery">
                {images.map((image, index) => !image.isRemoved && (
                    <div key={image.id || index} className={styles.imageItem} role="listitem">
                        <div
                            className={`${styles.imagePreview} ${styles.clickable} ${imageErrors[index] ? styles.imageError : ''}`}
                            onClick={() => openViewer(index)}
                            role="button"
                            aria-label={`Open image preview ${index + 1}${image.caption ? ` - ${image.caption}` : ''}`}
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openViewer(index) }}
                        >
                            <img
                                src={image.url}
                                alt={image.caption || `Image ${index + 1}`}
                                onError={() => handleImageError(index)}
                                style={{ display: imageErrors[index] ? 'none' : 'block' }}
                            />
                            {imageErrors[index] && (
                                <div className={styles.errorPlaceholder}>
                                    <span>Image not available</span>
                                </div>
                            )}
                            {image.isPrimary && <span className={styles.primaryBadge}>Primary</span>}
                        </div>
                        <input
                            type="text"
                            placeholder="Caption"
                            className={styles.captionInput}
                            value={image.caption}
                            onChange={(e) => onCaptionChange(index, e.target.value)}
                            aria-label={`Caption for image ${index + 1}`}
                        />
                        <div className={styles.imageActions}>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary} ${image.isPrimary ? styles.active : ''}`}
                                onClick={() => onSetPrimary(index)}
                                disabled={image.isPrimary || imageErrors[index]}
                                aria-pressed={image.isPrimary}
                                aria-label={`Set image ${index + 1} as primary`}
                            >
                                Set as Primary
                            </button>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.buttonDanger}`}
                                onClick={() => onRemoveImage(index)}
                                aria-label={`Remove image ${index + 1}`}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ImageViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                src={viewerIndex !== null && !imageErrors[viewerIndex] ? images[viewerIndex]?.url : ''}
                caption={viewerIndex !== null ? images[viewerIndex]?.caption : undefined}
            />
        </>
    )
}
