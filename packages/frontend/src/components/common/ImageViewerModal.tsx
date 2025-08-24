import styles from '@/styles/modal.module.css'
import { useEffect } from 'react'

interface ImageViewerModalProps {
    isOpen: boolean
    src: string
    caption?: string
    alt?: string
    onClose: () => void
}

export default function ImageViewerModal({ isOpen, src, caption, alt, onClose }: ImageViewerModalProps) {
    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" onClick={handleOverlayClick}>
            <div className={styles.viewer}>
                <div className={styles.viewerBody}>
                    <img className={styles.viewerImage} src={src} alt={alt || caption || 'Image'} />
                </div>
                {caption && <div className={styles.viewerCaption}>{caption}</div>}
                <div className={styles.viewerActions}>
                    <button className={styles.viewerClose} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}
