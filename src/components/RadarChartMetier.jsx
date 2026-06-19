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
import { NIVEAU_ETUDES } from "../utils/scoring";

const AXES = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q7", "Q8"];

const Q2_COURT = { 3: "CAP", 4: "Bac", 5: "BTS", 6: "Licence", 7: "Master+" };

function answerLabel(key, reponses) {
  switch (key) {
    case "Q1": {
      const val = reponses?.Q1 ?? "";
      return val.split("/")[0].trim() || "Secteur";
    }
    case "Q2":
      return Q2_COURT[Number(reponses?.Q2)] ?? "Études";
    case "Q3":
      return reponses?.Q3 ?? "Cadre";
    case "Q4": {
      const val = reponses?.Q4 ?? "";
      if (val.startsWith("Prendre soin")) return "Animaux";
      if (val.startsWith("Cuisinier")) return "Cuisiner";
      if (val.startsWith("Partager")) return "Vendre";
      return val.split(/[/,]/)[0].trim().split(" ")[0] || "Attrait";
    }
    case "Q5":
      return reponses?.Q5 === "Oui" ? "Contrainte" : "Mobile";
    case "Q7":
      return reponses?.Q7 ?? "Budget";
    case "Q8":
      return reponses?.Q8 === "Oui" ? "Expérimenté" : "Reconversion";
    default:
      return key;
  }
}

export default function RadarChartMetier({ metier, normalizedScores, reponses }) {
  const radarData = AXES.map((key) => ({
    name: answerLabel(key, reponses),
    Métier: Math.round((metier.poids?.[key] ?? 0) * 100),
    Vous: Math.round((normalizedScores?.[key] ?? 0) * 100),
  }));

  return (
    <div className="radar-compact">
      <div className="radar-chart-wrapper" aria-hidden="true">
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart
            data={radarData}
            margin={{ top: 14, right: 72, bottom: 14, left: 72 }}
          >
            <PolarGrid stroke="var(--border, #E8E8E8)" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: "#424242", fontSize: 10, fontFamily: "Poppins, sans-serif" }}
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
