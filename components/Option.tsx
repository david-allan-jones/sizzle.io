import { useMemo } from "react"
import styles from '@/styles/Home.module.css'

export function Option(props: { value: string, onDelete: () => void }) {
    const option = useMemo(() => props.value, [props.value])
    
    return <div style={{ textAlign: 'left', marginBottom: '5px' }}>
        <button className={`${styles.secondaryBtn} ${styles.deleteOptionBtn}`} type="button" onClick={props.onDelete}>-</button>
        <span>{option}</span>
    </div>
}