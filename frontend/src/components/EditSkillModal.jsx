import { useEffect, useState } from 'react';

export default function EditSkillModal({ skill, open, onClose, onSave, saving = false }) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    prioridad: 'Media',
    estado: 'Activo',
    notas: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skill) {
      setForm({
        nombre: skill.nombre ?? '',
        categoria: skill.categoria ?? '',
        prioridad: skill.prioridad ?? 'Media',
        estado: skill.estado ?? 'Activo',
        notas: skill.notas ?? '',
      });
      setError(null);
    }
  }, [skill]);

  if (!open || !skill) return null;

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
      await onSave({
        ...skill,
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        prioridad: form.prioridad,
        estado: form.estado,
        notas: form.notas,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-skill-title"
      >
        <div className="modal__header">
          <h2 id="edit-skill-title">Editar skill</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-grid form-grid--single">
            <label className="form-field">
              <span>Nombre</span>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
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

            <label className="form-field">
              <span>Estado</span>
              <select name="estado" value={form.estado} onChange={handleChange}>
                <option value="Activo">Activo</option>
                <option value="Pausado">Pausado</option>
                <option value="Completado">Completado</option>
              </select>
            </label>

            <label className="form-field">
              <span>Notas</span>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                rows={4}
                placeholder="Objetivos, recursos, observaciones..."
              />
            </label>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
