import styles from '@styles/formComponents.module.css'
import { ChangeEvent, ReactNode } from 'react'

interface FormFieldProps {
    id: string
    label: string
    value: string | number | readonly string[]
    onChange: (value: string) => void
    required?: boolean
    type?: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'select'
    placeholder?: string
    error?: string
    min?: number
    max?: number
    options?: Array<{ value: string, label: string }>
    helpText?: string | ReactNode
}

export default function FormField({
    id,
    label,
    value,
    onChange,
    required = false,
    type = 'text',
    placeholder = '',
    error,
    min,
    max,
    options = [],
    helpText
}: FormFieldProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        onChange(e.target.value)
    }

    const renderField = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        id={id}
                        className={`${styles.textarea} ${error ? styles.inputError : ''}`}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        placeholder={placeholder}
                    />
                )
            case 'select':
                return (
                    <select
                        id={id}
                        className={`${styles.select} ${error ? styles.inputError : ''}`}
                        value={value as string}
                        onChange={handleChange}
                        required={required}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )
            case 'number':
                return (
                    <input
                        id={id}
                        type="number"
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                    />
                )
            default:
                return (
                    <input
                        id={id}
                        type={type}
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        placeholder={placeholder}
                    />
                )
        }
    }

    return (
        <div className={styles.formGroup}>
            <label htmlFor={id} className={styles.label}>
                {label} {required && '*'}
            </label>

            {renderField()}

            {helpText && <div className={styles.helpText}>{helpText}</div>}
            {error && <div className={styles.errorText}>{error}</div>}
        </div>
    )
}
