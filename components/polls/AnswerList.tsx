import { Option } from "@/store/redis"

type Props = {
    options: Option[]
    onIndexChange: (idx: number) => void
}

export default function AnswerList(props: Props) {
    return <div>
    {props.options.map((o, i) => (
        <label key={i} htmlFor={o.text} className="radio-container">
            <input
                type="radio"
                onChange={() => props.onIndexChange(i)}
                id={o.text}
                name="answer-radio"
            />
                {o.text}
            <span className='checkmark'></span>
        </label>
    ))}
    </div>
}