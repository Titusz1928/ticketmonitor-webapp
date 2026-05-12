import { ResponsiveContainer, PieChart, Cell, Pie, Tooltip, Legend } from 'recharts';

type DonutChartProps<T extends object> = {
    title: string;
    data: T[];
    nameKey: keyof T;
    dataKey: keyof T;
};

const COLORS = [
    '#0011ff', 
    '#00e5ff', 
    '#ffbb28', 
    '#ff8042', 
    '#000000',
    "#7c3aed",
    "#16a34a",
    "#dc2626",
    "#0891b2",
    "#9333ea",
];

function KPIDonutChart<T extends object>( {
    title,
    data,
    nameKey,
    dataKey,
 }: DonutChartProps<T>) {
    return (
        <div className="chart-card">
            <h3> {title} </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data}
                      nameKey={nameKey as string}
                      dataKey={dataKey as string}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {data.map((_, index) => (
                        <Cell 
                            key={`${title}-cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
        </div>
    );
}

export default KPIDonutChart