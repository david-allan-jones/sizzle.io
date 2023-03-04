import { useMemo } from "react"

export function Option(props: { value: string, onDelete: () => void }) {
    const option = useMemo(() => props.value, [props.value])
    
    return <div>
        <span>{option}</span>
        <button type="button" onClick={props.onDelete}>-</button>
    </div>
}