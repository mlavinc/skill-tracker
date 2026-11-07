import SessionForm from './SessionForm';

export default function SessionModal({ skill, open, onClose, onSubmit, submitting = false }) {
  if (!open || !skill) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-modal-title"
      >
        <div className="modal__header">
          <h2 id="session-modal-title">Nueva práctica · {skill.nombre}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <SessionForm onSubmit={onSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
