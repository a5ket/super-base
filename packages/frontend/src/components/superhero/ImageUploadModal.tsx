import { imagesApi } from '@/services/api/images'
import modalStyles from '@/styles/modal.module.css'
import styles from '@/styles/superheroForm.module.css'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (url: string) => void
}

export default function ImageUploadModal({ isOpen, onClose, onSave }: ImageUploadModalProps) {
    const [url, setUrl] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [objectUrl, setObjectUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) {
            setUrl('')
            setFile(null)
            setSaving(false)
            setError(undefined)
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
                setObjectUrl(null)
            }
        }
    }, [isOpen, objectUrl])

    useEffect(() => {
        if (!file) {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
                setObjectUrl(null)
            }
            return
        }
        const next = URL.createObjectURL(file)
        setObjectUrl(next)
        return () => {
            URL.revokeObjectURL(next)
        }
    }, [file])

    const preview = objectUrl || url || ''

    const isValidUrl = (value: string) => {
        try {
            const parsed = new URL(value)
            return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        } catch {
            return false
        }
    }

    const onDrop = useCallback((accepted: File[]) => {
        const f = accepted[0]
        if (f) {
            setFile(f)
            setUrl('')
            setError(undefined)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'image/*': [] },
        disabled: !!url
    })

    const handleSave = async () => {
        setError(undefined)
        setSaving(true)
        try {
            if (file) {
                const uploaded = await imagesApi.upload(file)
                onSave(uploaded.url)
            } else if (url && isValidUrl(url)) {
                onSave(url)
            } else {
                setError('Please select a file or provide a valid URL')
                return
            }
            onClose()
        } catch (err) {
            console.error('Upload error:', err)
            setError(err instanceof Error ? err.message : 'Failed to upload image')
        } finally {
            setSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className={modalStyles.overlay} role="dialog" aria-modal="true">
            <div className={modalStyles.modal}>
                <div className={modalStyles.header}>
                    <h3>Add Image</h3>
                </div>
                <div className={modalStyles.content}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formgroup}>
                        <label className={styles.label}>Image URL</label>
                        <input
                            type="url"
                            className={styles.input}
                            placeholder="https://example.com/image.jpg"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value)
                                setFile(null)
                                setError(undefined)
                            }}
                            disabled={!!file || saving}
                        />
                        {url && !isValidUrl(url) && (
                            <div className={styles.helptext} style={{ color: '#f87171' }}>Please enter a valid URL</div>
                        )}
                    </div>

                    <div className={modalStyles.divider}>or</div>

                    <div className={styles.formgroup}>
                        <label className={styles.label}>Upload File</label>
                        <div
                            {...getRootProps({
                                className: `${styles.imagepreview} ${isDragActive ? styles.active : ''}`
                            })}
                            style={{
                                height: '120px',
                                cursor: 'pointer',
                                border: isDragReject ? '1px solid #f87171' : '1px dashed #334155',
                                backgroundColor: isDragActive ? 'rgba(16, 185, 129, 0.1)' : '#0f172a'
                            }}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <small>{file.name}</small>
                            ) : (
                                <p>Drag and drop an image here, or click to select</p>
                            )}
                        </div>
                    </div>

                    {preview && (
                        <div className={styles.formgroup}>
                            <label className={styles.label}>Preview</label>
                            <div className={styles.imagepreview} style={{ height: '180px' }}>
                                <img src={preview} alt="Preview" style={{ objectFit: 'contain' }} />
                            </div>
                        </div>
                    )}
                </div>
                <div className={modalStyles.actions}>
                    <button
                        className={styles.cancelbutton}
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.submitbutton}
                        onClick={handleSave}
                        disabled={saving || (!file && !isValidUrl(url))}
                        style={{ opacity: saving || (!file && !isValidUrl(url)) ? 0.7 : 1 }}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}
