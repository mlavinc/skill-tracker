import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import EditSkillModal from '../components/EditSkillModal';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import SessionForm from '../components/SessionForm';
import SessionList from '../components/SessionList';
import { useSessions, useSkill } from '../hooks/useSkills';
import { formatDate, statusClass } from '../utils/format';

export default function SkillDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { skill, loading, error, fetchSkill } = useSkill(id);
  const {
    sessions,
    loading: sessionsLoading,
    error: sessionsError,
    fetchSessions,
    createSession,
  } = useSessions(id);

  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSessionSubmit = async (payload) => {
    setSubmittingSession(true);
    try {
      await createSession(payload);
      await fetchSkill();
    } finally {
      setSubmittingSession(false);
    }
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      await api.updateSkill(payload.id, payload);
      await fetchSkill();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteSkill(id);
      navigate('/skills');
    } catch {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <LoadingSpinner label="Cargando habilidad..." />
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="page">
        <Link to="/skills" className="back-link">
          ← Volver a habilidades
        </Link>
        <ErrorMessage message={error || 'Habilidad no encontrada'} onRetry={fetchSkill} />
      </div>
    );
  }

  return (
    <div className="page skill-detail">
      <Link to="/skills" className="back-link">
        ← Volver a habilidades
      </Link>

      <section className="skill-detail__hero">
        <div className="skill-detail__hero-content">
          <div className="skill-detail__badges">
            <span className={`badge ${statusClass(skill.estado)}`}>
              {skill.estado || 'Activo'}
            </span>
            <span className="badge badge--neutral">{skill.categoria}</span>
          </div>
          <h1>{skill.nombre}</h1>
          <p className="skill-detail__meta">
            Creada el {formatDate(skill.creado_en)} · Última práctica:{' '}
            {formatDate(skill.ultima_practica)}
          </p>
        </div>

        <div className="skill-detail__hero-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Eliminar
          </button>
        </div>
      </section>

      <div className="skill-detail__grid">
        <section className="detail-panel">
          <h2>Progreso</h2>
          <ProgressBar value={skill.progreso} />
          <dl className="detail-list">
            <div>
              <dt>Prioridad</dt>
              <dd>{skill.prioridad}</dd>
            </div>
            <div>
              <dt>Última práctica</dt>
              <dd>{formatDate(skill.ultima_practica)}</dd>
            </div>
          </dl>

          <div className="detail-notes">
            <h3>Notas</h3>
            <p>{skill.notas || 'Sin notas registradas.'}</p>
          </div>
        </section>

        <section className="detail-panel">
          <SessionForm onSubmit={handleSessionSubmit} submitting={submittingSession} />
        </section>
      </div>

      <section className="detail-panel detail-panel--full">
        <div className="section-header">
          <h2>Historial de prácticas</h2>
          <span className="section-header__count">{sessions.length}</span>
        </div>
        <SessionList
          sessions={sessions}
          loading={sessionsLoading}
          error={sessionsError}
          onRetry={fetchSessions}
        />
      </section>

      <EditSkillModal
        skill={skill}
        open={editing}
        onClose={() => setEditing(false)}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Eliminar habilidad"
        message={`¿Seguro que quieres eliminar "${skill.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={isDeleting}
      />
    </div>
  );
}
