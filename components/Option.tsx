import { useMemo } from "react"
import styles from '@/styles/Home.module.css'

export function Option(props: { value: string, onDelete: () => void }) {
    const option = useMemo(() => props.value, [props.value])
    
    return <div style={{ textAlign: 'left', marginBottom: '5px', display: 'flex' }}>
        <button
            className={`${styles.secondaryBtn} ${styles.deleteOptionBtn}`}
            type="button"
            onClick={props.onDelete}
            style={{ flex: 1, marginRight: '20px' }}
        >
            -
        </button>
        <span
            style={{ flex: 4 }}
        >
            {option}
        </span>
    </div>
}