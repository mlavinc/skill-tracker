import { useState } from 'react';

const initialForm = {
  nombre: '',
  categoria: '',
  prioridad: 'Media',
};

export default function SkillForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim() || !form.categoria.trim()) {
      setError('Nombre y categoría son obligatorios.');
      return;
    }

    try {
      await onSubmit({
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        prioridad: form.prioridad,
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Nueva skill</h2>
      <p className="form-card__subtitle">
        Registra una habilidad que quieras desarrollar.
      </p>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <label className="form-field">
          <span>Nombre</span>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Go, React, Piano..."
            required
          />
        </label>

        <label className="form-field">
          <span>Categoría</span>
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Ej. Backend, Música..."
            required
          />
        </label>

        <label className="form-field">
          <span>Prioridad</span>
          <select name="prioridad" value={form.prioridad} onChange={handleChange}>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Creando...' : 'Crear skill'}
      </button>
    </form>
  );
}
