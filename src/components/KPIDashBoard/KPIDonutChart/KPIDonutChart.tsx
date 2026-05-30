import { ResponsiveContainer, PieChart, Cell, Pie, Tooltip, Legend } from 'recharts';
import './KPIDonutChart.css';

type DonutChartProps<T extends object> = {
    title: string;
    data: T[];
    nameKey: keyof T;
    dataKey: keyof T;
    onItemClick?: (item: T) => void;
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
    onItemClick,
 }: DonutChartProps<T>) {
    return (
        <div className="chart-card donut-card-wrapper">
            <h3> {title} </h3>
            {/* Increased height slightly from 141px to 160px for dynamic readability */}
            <ResponsiveContainer width="100%" height={141.25}>
              <PieChart>
                <Pie
                  data={data}
                  nameKey={nameKey as string}
                  dataKey={dataKey as string}
                  /* Increased radius values to maximize total geometric size */
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={4}
                  /* cx handles horizontal center alignment. 40% offsets it nicely to the left */
                  cx="40%"
                  cy="50%"
                  onClick={(_, index) => {
                    if (onItemClick && index >= 0 && data[index]) {
                      onItemClick(data[index]);
                    }
                  }}
                  style={{ cursor: onItemClick ? 'pointer' : 'default' }}
                >
                  {data.map((item, index) => (
                    <Cell 
                        key={`${title}-cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        onClick={() => {
                          if (onItemClick) {
                            onItemClick(item);
                          }
                        }}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  /* CHANGED: Rearranges legend directly to the right margin */
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    fontSize: '12px',
                    lineHeight: '1.5',
                    maxWidth: '45%', /* Prevents long item names from squishing the chart */
                    maxHeight: '140px',
                    overflowY: 'auto',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default KPIDonutChart;