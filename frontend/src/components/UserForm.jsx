import { useState } from 'react';

const COLOR_PRESETS = [
  '#6c8cff',
  '#4ade80',
  '#f472b6',
  '#fbbf24',
  '#38bdf8',
  '#a78bfa',
  '#fb7185',
  '#34d399',
];

export default function UserForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState({ nombre: '', color: COLOR_PRESETS[0] });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      await onSubmit({
        nombre: form.nombre.trim(),
        color: form.color,
      });
      setForm({ nombre: '', color: COLOR_PRESETS[0] });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form-card user-form" onSubmit={handleSubmit}>
      <h2>Crear usuario</h2>
      <p className="form-card__subtitle">Regístrate para empezar a trackear tus skills.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid form-grid--single">
        <label className="form-field">
          <span>Nombre</span>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder="Tu nombre"
            required
          />
        </label>

        <div className="form-field">
          <span>Color</span>
          <div className="color-picker">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-picker__swatch${form.color === color ? ' color-picker__swatch--active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                aria-label={`Color ${color}`}
              />
            ))}
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
              className="color-picker__input"
              aria-label="Selector de color personalizado"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  );
}
