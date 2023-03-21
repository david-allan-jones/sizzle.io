import { useMemo } from "react"
import styles from '@/styles/Home.module.css'

export function Option(props: { value: string, onDelete: () => void }) {
    const option = useMemo(() => props.value, [props.value])
    
    return <div style={{ textAlign: 'left', marginBottom: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
        <button
            className={styles.secondaryBtn}
            type="button"
            onClick={props.onDelete}
            style={{ marginRight: '20px', flexBasis: '40px' }}
        >
            -
        </button>
        <div style={{
            overflowWrap: 'anywhere',
        }}>
            <p style={{ fontFamily: 'arial' }}>
                {option}
            </p>
        </div>
    </div>
}