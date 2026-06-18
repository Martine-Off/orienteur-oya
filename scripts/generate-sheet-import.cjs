#!/usr/bin/env node
/**
 * Génère data/Sheet_Metiers_import.csv — à importer dans l'onglet "Métiers" du Google Sheet.
 * Colonnes A-P avec pondérations calculées par logique métier + attributs.
 * Usage : node scripts/generate-sheet-import.cjs
 */
const fs = require("fs");
const path = require("path");

const csvPath = path.join(__dirname, "..", "data", "CSV_87_Metiers_OYA_V2_Niveau_MIN.csv");
const outPath = path.join(__dirname, "..", "data", "Sheet_Metiers_import.csv");

function parseLine(line) {
  const cols = [];
  let cur = "", inq = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inq) {
      if (c === '"') { if (line[i+1] === '"') { cur += '"'; i++; } else inq = false; }
      else cur += c;
    } else if (c === '"') inq = true;
    else if (c === ',') { cols.push(cur); cur = ""; }
    else cur += c;
  }
  cols.push(cur);
  return cols;
}

const raw = fs.readFileSync(csvPath, "utf8");
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const headers = parseLine(lines[0]).map(h => h.trim());
const rows = lines.slice(1);

// ── Logique pondérations ──────────────────────────────────────────────────────

// Q1 : Secteur d'origine → pertinence au domaine (via Type activité)
const Q1_MAP = { Produire: 0.85, Transformer: 0.70, Former: 0.60, Analyser: 0.55, Piloter: 0.55 };

// Q2 : Niveau études → niveau minimum requis
const Q2_MAP = { 3: 0.45, 4: 0.55, 5: 0.65, 6: 0.80, 7: 0.85 };

// Q4 : Ce qui attire → critère le plus discriminant
const Q4_MAP = { Produire: 0.95, Transformer: 0.90, Analyser: 0.90, Former: 0.88, Piloter: 0.85 };

// Q5 : Contraintes physiques → pénibilité du poste
const Q5_MAP = { Produire: 0.70, Transformer: 0.55, Piloter: 0.30, Former: 0.25, Analyser: 0.20 };

// Q6 : Temps disponible → durée de formation
const Q6_BACK = { CAP: 0.85, BTSA: 0.65, Master: 0.35 };

// Q7 : Budget → capital requis
const Q7_SIT = { Zéro: 0.90, Terrain: 0.65, Capital: 0.40 };

function pQ3(loc) {
  if (loc.includes("Flexible")) return 0.85;
  if (loc === "Urbain") return 0.70;
  if (loc === "Campagne") return 0.65;
  return 0.75;
}

function pQ7(situation) {
  if (situation === "Zéro") return 0.90;
  if (situation.includes("Terrain") && situation.includes("Capital")) return 0.52;
  if (situation.includes("Zéro") || situation.includes("Terrain")) return Q7_SIT[situation] || 0.65;
  if (situation.includes("Capital")) return 0.40;
  return 0.55;
}

function pQ8(bloc, typeActivite) {
  if (bloc === "Production agricole" && typeActivite === "Produire") return 0.95;
  if (bloc === "Production agricole") return 0.80;
  if (bloc === "Transformation agroalimentaire") return 0.55;
  if (bloc === "Restauration") return 0.35;
  if (bloc === "Logistique distribution") return 0.40;
  return 0.30; // Transversal
}

// ── Attributs ─────────────────────────────────────────────────────────────────

// Secteur ← "Type métier générique" du CSV (fallback: "Thématique formation")
function secteur(typeMetierGenerique, thematiqueFormation) {
  return typeMetierGenerique || thematiqueFormation || "N/A";
}

// Autonomie ← "Type activité" du CSV (valeur brute : Produire/Transformer/Former/Analyser/Piloter)
function autonomie(typeActivite) {
  return typeActivite || "N/A";
}

// Pénurie — inventé : Statut "Tension" → en tension, sinon Normal
function penurie(statut) {
  return statut === "Tension" ? "En tension" : "Normal";
}

// Évolution — inventé : Statut "Émergent" → Émergent, sinon Traditionnel
function evolution(statut) {
  return statut === "Émergent" ? "Émergent" : "Traditionnel";
}

// Compétences ← "Intentions clés" du CSV (séparées par " - ", on garde les 3 premières)
function competences(intentions) {
  const parts = intentions.split("-").map(s => s.trim()).filter(Boolean).slice(0, 3);
  return parts.join(", ");
}

function niveau(niveauMin) {
  const n = parseInt(niveauMin) || 4;
  const map = { 3: "CAP/BEP", 4: "Bac", 5: "BTS/BTSA", 6: "Licence", 7: "Master" };
  return map[n] || "Bac";
}

// ── Génération ────────────────────────────────────────────────────────────────

function esc(s) {
  s = String(s);
  return s.includes(",") || s.includes('"') ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const output = ["Métier,Bloc,Poids_Q1,Poids_Q2,Poids_Q3,Poids_Q4,Poids_Q5,Poids_Q6,Poids_Q7,Poids_Q8,Secteur,Autonomie,Pénurie,Évolution,Compétences,Niveau"];

rows.forEach(line => {
  const cols = parseLine(line);
  const get = name => { const i = headers.indexOf(name); return i >= 0 ? (cols[i] || "").trim() : ""; };

  const metier              = get("Métier");
  const bloc                = get("Bloc");
  const statut              = get("Statut");
  const niveauMin           = get("Niveau_MIN");
  const localisation        = get("Localisation");
  const situation           = get("Situation");
  const backgroundMin       = get("Background min");
  const typeActivite        = get("Type activité");
  const intentions          = get("Intentions clés");
  const typeMetierGenerique = get("Type métier générique");
  const thematiqueFormation = get("Thématique formation");

  if (!metier) return;

  const row = [
    esc(metier),
    esc(bloc),
    Q1_MAP[typeActivite]           ?? 0.60,
    Q2_MAP[parseInt(niveauMin)]    ?? 0.65,
    pQ3(localisation),
    Q4_MAP[typeActivite]           ?? 0.85,
    Q5_MAP[typeActivite]           ?? 0.40,
    Q6_BACK[backgroundMin]         ?? 0.55,
    pQ7(situation),
    pQ8(bloc, typeActivite),
    esc(secteur(typeMetierGenerique, thematiqueFormation)),
    autonomie(typeActivite),
    penurie(statut),
    evolution(statut),
    esc(competences(intentions)),
    niveau(niveauMin),
  ];

  output.push(row.join(","));
});

// BOM UTF-8 pour que Google Sheets détecte l'encodage à l'import
fs.writeFileSync(outPath, "﻿" + output.join("\n"), "utf8");
console.log(`${output.length - 1} métiers → ${outPath}`);
