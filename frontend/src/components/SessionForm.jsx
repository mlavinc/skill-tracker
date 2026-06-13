import { useState } from 'react';

const initialForm = {
  duracion_minutos: '',
  notas: '',
  progreso_percibido: '',
};

export default function SessionForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const duracion = Number(form.duracion_minutos);
    const progreso = Number(form.progreso_percibido);

    if (!duracion || duracion <= 0) {
      setError('La duración debe ser mayor a 0 minutos.');
      return;
    }

    if (Number.isNaN(progreso) || progreso < 0) {
      setError('El progreso percibido debe ser un número válido.');
      return;
    }

    try {
      await onSubmit({
        duracion_minutos: duracion,
        notas: form.notas.trim(),
        progreso_percibido: progreso,
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Registrar sesión</h2>
      <p className="form-card__subtitle">
        Documenta tu sesión de práctica y actualiza tu progreso.
      </p>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid form-grid--single">
        <label className="form-field">
          <span>Duración (minutos)</span>
          <input
            type="number"
            name="duracion_minutos"
            value={form.duracion_minutos}
            onChange={handleChange}
            min="1"
            placeholder="30"
            required
          />
        </label>

        <label className="form-field">
          <span>Progreso percibido (%)</span>
          <input
            type="number"
            name="progreso_percibido"
            value={form.progreso_percibido}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="5"
            required
          />
        </label>

        <label className="form-field">
          <span>Notas</span>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            rows={3}
            placeholder="Qué practicaste, dificultades, logros..."
          />
        </label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Registrando...' : 'Registrar sesión'}
      </button>
    </form>
  );
}
