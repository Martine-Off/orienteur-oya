import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AXES = [
  { key: "Q1", label: "Secteur" },
  { key: "Q2", label: "Études" },
  { key: "Q3", label: "Cadre" },
  { key: "Q4", label: "Attrait" },
  { key: "Q5", label: "Mobilité" },
  { key: "Q7", label: "Budget" },
  { key: "Q8", label: "Expérience" },
];

export default function RadarChartMetier({ metier, normalizedScores }) {
  const radarData = AXES.map(({ key, label }) => ({
    name: label,
    Métier: Math.round((metier.poids?.[key] ?? 0) * 100),
    Vous: Math.round((normalizedScores?.[key] ?? 0) * 100),
  }));

  return (
    <div className="radar-compact">
      <div className="radar-chart-wrapper" aria-hidden="true">
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart
            data={radarData}
            margin={{ top: 10, right: 48, bottom: 10, left: 48 }}
          >
            <PolarGrid stroke="var(--border, #E8E8E8)" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: "#424242", fontSize: 11, fontFamily: "Poppins, sans-serif" }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Critères du métier"
              dataKey="Métier"
              stroke="#A85D08"
              fill="#A85D08"
              fillOpacity={0.2}
            />
            <Radar
              name="Votre profil"
              dataKey="Vous"
              stroke="#2E7D33"
              fill="#2E7D33"
              fillOpacity={0.15}
            />
            <Tooltip
              formatter={(v) => `${v}%`}
              contentStyle={{
                fontSize: 12,
                fontFamily: "Poppins, sans-serif",
                border: "1px solid var(--border, #E8E8E8)",
                borderRadius: 6,
              }}
            />
            <Legend iconType="line" wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="radar-desc">
        <strong style={{ color: "#A85D08" }}>Orange</strong> = ce que ce métier valorise.{" "}
        <strong style={{ color: "#2E7D33" }}>Vert</strong> = votre profil.
      </p>

      <div
        className="radar-table"
        role="table"
        aria-label={`Correspondance avec ${metier.metier}`}
      >
        <div role="rowgroup">
          <div className="radar-table__row radar-table__row--head" role="row">
            <span role="columnheader">Critère</span>
            <span role="columnheader">Métier</span>
            <span role="columnheader">Vous</span>
          </div>
        </div>
        <div role="rowgroup">
          {radarData.map((row) => (
            <div key={row.name} className="radar-table__row" role="row">
              <span role="cell">{row.name}</span>
              <span role="cell">{row["Métier"]}%</span>
              <span role="cell">{row["Vous"]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
