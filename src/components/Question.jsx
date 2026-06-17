import { REGIONS_FRANCE } from "../data/questions";



/**
 * Composant générique de question fermée. Le `type` choisit le rendu mais
 * tous les types reposent sur des <input type="radio"> natifs pour garantir
 * la navigation clavier (Tab/Espace/flèches) et la compatibilité lecteurs
 * d'écran sans JS additionnel.
 */
export default function Question({ question, value, onChange }) {
  const name = question.id;

  if (question.type === "checkboxes") {
    const checked = value || {};
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        {question.hint && <p className="question-hint">{question.hint}</p>}
        <div className="question-divider" aria-hidden="true" />
        <div className="options-checkboxes">
          {question.options.map((opt) => (
            <label key={opt.key} className="checkbox-option">
              <input
                type="checkbox"
                name={name}
                value={opt.key}
                checked={!!checked[opt.key]}
                onChange={(e) => onChange({ ...checked, [opt.key]: e.target.checked })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === "chips") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <div className="options options-chips">
          {question.options.map((opt) => (
            <label
              key={opt.value}
              className={`option-pill ${value === opt.value ? "selected" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === "select") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <label className="select-label" htmlFor={name}>
          Choisissez une réponse
        </label>
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            -- Sélectionner --
          </option>
          {question.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </fieldset>
    );
  }

  if (question.type === "region") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <label className="select-label" htmlFor={name}>
          Région
        </label>
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            -- Sélectionner --
          </option>
          {REGIONS_FRANCE.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </fieldset>
    );
  }

  if (question.type === "oui-non") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <div className="options options-inline">
          {["Oui", "Non"].map((opt) => (
            <label key={opt} className={`option-pill ${value === opt ? "selected" : ""}`}>
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === "cartes") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <div className="options options-cards">
          {question.options.map((opt) => (
            <label key={opt} className={`option-card ${value === opt ? "selected" : ""}`}>
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  // type === "choix" : boutons radio standards
  return (
    <fieldset className="question">
      <legend>{question.titre}</legend>
      <div className="options">
        {question.options.map((opt) => (
          <label key={opt} className={`option-pill ${value === opt ? "selected" : ""}`}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
