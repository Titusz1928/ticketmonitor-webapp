import type { SimpleKPI } from '../../types/KPI';

type KPICardProps = {
    kpi: SimpleKPI;
}

function KPICard({ kpi }: KPICardProps) {
    return (
        <div className = "stat-card">
            <h3> {kpi.label} </h3>
            <p className = "stat-value">
                {kpi.value}
                {kpi.unit ? `${kpi.unit}` : ""}
            </p>
        </div>
    );
}

export default KPICard