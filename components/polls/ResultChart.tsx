import { Option } from "@/store/redis"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Props = {
    options: Option[]
}

function mapToChart(options: Option[]) {
    return options.map(o => ({
        Answer: o.text,
        Count: o.count
    })) 
}

export default function ResultChart(props: Props) {
    return (
        <ResponsiveContainer width='100%' height={props.options.length * 50}>
            <BarChart 
                barSize={24}
                style={{ fill: 'white' }}
                data={mapToChart(props.options)}
                layout="vertical"
            >
                <XAxis
                    tick={{ width: 10 }}
                    stroke='#cecece'
                    style={{ fill: 'white' }}
                    type="number"
                    tickCount={1}
                />
                <YAxis
                    stroke='#cecece'
                    style={{ fill: 'white' }}
                    dataKey="Answer"
                    type="category"
                />
                <Tooltip wrapperStyle={{color: 'black'}} itemStyle={{color: 'black'}}/>
                <Bar dataKey="Count" fill="#FFB200" />
            </BarChart>
        </ResponsiveContainer>
    )
}