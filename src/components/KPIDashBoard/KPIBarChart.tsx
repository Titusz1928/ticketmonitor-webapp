import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer  } from 'recharts';

type BarChartProps<T extends object> = {
    title: string;
    data: T[];
    xKey: keyof T;
    yKey: keyof T;
};

function KPIBarChart<T extends object>({
    title,
    data,
    xKey, 
    yKey,
}: BarChartProps<T>) {
    return (
        <div className = "chart-card">
            <h3> {title} </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data = {data}>
                    <XAxis dataKey = {xKey as string} />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                        dataKey = {yKey as string}
                        fill="#0011ff" 
                        radius={[4, 4, 0, 0]} 
                    />
                    </BarChart>
                </ResponsiveContainer>
        </div>
    )
}

export default KPIBarChart