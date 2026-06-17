import { REGIONS_FRANCE } from "../data/questions";

export default function Question({ question, value, onChange }) {
  const name = question.id;

  if (question.type === "checkboxes") {
    const checked = value || {};
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        {question.hint && <p className="question-hint">{question.hint}</p>}
        <div className="options-blocs options-blocs--multi">
          {question.options.map((opt) => (
            <label
              key={opt.key}
              className={`bloc-option ${checked[opt.key] ? "selected" : ""}`}
            >
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
        <div className="options-blocs">
          {question.options.map((opt) => (
            <label
              key={opt.value}
              className={`bloc-option ${value === opt.value ? "selected" : ""}`}
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

  if (question.type === "cartes") {
    const hasImages = question.options.length > 0 && typeof question.options[0] === "object" && question.options[0].icon;
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <div className={`options-blocs options-blocs--grid${hasImages ? " options-blocs--image" : ""}`}>
          {question.options.map((opt) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            const optIcon = typeof opt === "object" ? opt.icon : null;
            const optLabel = typeof opt === "string" ? opt : opt.label ?? opt.value;
            return (
              <label
                key={optValue}
                className={`bloc-option${optIcon ? " bloc-option--with-image" : ""} ${value === optValue ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={optValue}
                  checked={value === optValue}
                  onChange={() => onChange(optValue)}
                />
                {optIcon && <img src={optIcon} alt="" className="bloc-option__icon" aria-hidden="true" />}
                <span>{optLabel}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (question.type === "select") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <label className="select-label" htmlFor={name}>Choisissez une réponse</label>
        <select id={name} name={name} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="" disabled>-- Sélectionner --</option>
          {question.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </fieldset>
    );
  }

  if (question.type === "region") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <label className="select-label" htmlFor={name}>Région</label>
        <select id={name} name={name} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="" disabled>-- Sélectionner --</option>
          {REGIONS_FRANCE.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </fieldset>
    );
  }

  if (question.type === "oui-non") {
    return (
      <fieldset className="question">
        <legend>{question.titre}</legend>
        <div className="options-blocs options-blocs--inline">
          {["Oui", "Non"].map((opt) => (
            <label key={opt} className={`bloc-option ${value === opt ? "selected" : ""}`}>
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

  // type === "choix"
  return (
    <fieldset className="question">
      <legend>{question.titre}</legend>
      <div className="options-blocs">
        {question.options.map((opt) => {
          const optValue = typeof opt === "string" ? opt : opt.value;
          const optLabel = typeof opt === "string" ? opt : opt.label ?? opt.value;
          return (
            <label key={optValue} className={`bloc-option ${value === optValue ? "selected" : ""}`}>
              <input
                type="radio"
                name={name}
                value={optValue}
                checked={value === optValue}
                onChange={() => onChange(optValue)}
              />
              {optLabel}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
