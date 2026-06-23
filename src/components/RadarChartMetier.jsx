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
import { matchScoresPerQuestion } from "../utils/scoring";

const ALL_AXES = ["Q1", "Q2", "Q3", "Q4", "Q7", "Q8"];

const PREFIXES = {
  Q1: "Secteur",
  Q2: "Niveau",
  Q3: "Cadre",
  Q4: "Attrait",
  Q7: "Budget",
  Q8: "Agriculture",
};

const Q2_COURT = { 3: "CAP", 4: "Bac", 5: "BTS", 6: "Licence", 7: "Master+" };

function shortAnswer(key, reponses) {
  switch (key) {
    case "Q1": {
      const val = reponses?.Q1 ?? "";
      if (!val) return "—";
      return val.split("/")[0].trim();
    }
    case "Q2":
      return Q2_COURT[Number(reponses?.Q2)] ?? "—";
    case "Q3":
      return reponses?.Q3 ?? "—";
    case "Q4": {
      const val = reponses?.Q4 ?? "";
      if (val.startsWith("Prendre soin")) return "Animaux";
      if (val.startsWith("Cuisinier")) return "Cuisiner";
      if (val.startsWith("Partager")) return "Vendre";
      return val.split(/[/,]/)[0].trim().split(" ")[0] || "—";
    }
    case "Q7":
      return reponses?.Q7 ?? "—";
    case "Q8":
      return reponses?.Q8 ?? "—";
    default:
      return "—";
  }
}

const CustomTick = ({ x, y, payload }) => {
  const parts = payload.value.split("\n");
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#424242" fontSize={11} fontFamily="Poppins, sans-serif">
      <tspan x={x} dy="0">{parts[0]}</tspan>
      <tspan x={x} dy="14">{parts[1] || ""}</tspan>
    </text>
  );
};

export default function RadarChartMetier({ metier, reponses }) {
  const axes = ALL_AXES.filter((key) => (metier.poids?.[key] ?? 0) > 0);
  const matchScores = reponses ? matchScoresPerQuestion(reponses, metier) : {};

  const radarData = axes.map((key) => ({
    name: reponses
      ? `${PREFIXES[key]}:\n${shortAnswer(key, reponses)}`
      : PREFIXES[key],
    Métier: Math.round(metier.poids[key] * 100),
    Vous: Math.round((matchScores[key] ?? 0) * 100),
  }));

  return (
    <div className="radar-compact">
      <div className="radar-chart-wrapper" aria-hidden="true">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart
            data={radarData}
            margin={{ top: 10, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid stroke="var(--border, #E8E8E8)" />
            <PolarAngleAxis dataKey="name" tick={<CustomTick />} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Métier"
              dataKey="Métier"
              stroke="#A85D08"
              fill="#A85D08"
              fillOpacity={0.2}
            />
            <Radar
              name="Vous"
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
            <Legend iconType="line" wrapperStyle={{ fontSize: 11, marginTop: 30 }} />
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
