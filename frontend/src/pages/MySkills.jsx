import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import EditSkillModal from '../components/EditSkillModal';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import SessionModal from '../components/SessionModal';
import SkillCard from '../components/SkillCard';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';
import { api } from '../services/api';

export default function MySkills() {
  const { user } = useUser();
  const {
    skills,
    loading,
    error,
    fetchSkills,
    updateSkill,
    deleteSkill,
  } = useSkills(user?.id);

  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [sessionSkill, setSessionSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      await updateSkill(payload.id, payload);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSkill) return;
    setDeleting(true);
    try {
      await deleteSkill(deletingSkill.id);
      setDeletingSkill(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddSession = async (payload) => {
    if (!sessionSkill) return;
    setSubmittingSession(true);
    try {
      await api.createSession(sessionSkill.id, payload);
      await fetchSkills();
      setSessionSkill(null);
    } finally {
      setSubmittingSession(false);
    }
  };

  return (
    <div className="page">
      <section className="page-header page-header--split">
        <div>
          <h1>Mis Skills</h1>
          <p>Gestiona todas tus habilidades de aprendizaje.</p>
        </div>
        <div className="page-header__actions">
          <Link to="/skills/nueva" className="btn btn--primary btn--sm">
            Nueva skill
          </Link>
        </div>
      </section>

      {loading && <LoadingSpinner label="Cargando skills..." />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchSkills} />
      )}

      {!loading && !error && skills.length === 0 && (
        <EmptyState
          icon="🚀"
          title="Aún no tienes skills"
          description="Crea tu primera habilidad para empezar a trackear tu progreso."
          action={
            <Link to="/skills/nueva" className="btn btn--primary btn--sm">
              Crear skill
            </Link>
          }
        />
      )}

      {!loading && !error && skills.length > 0 && (
        <div className="skill-grid">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={setEditingSkill}
              onDelete={setDeletingSkill}
              onAddSession={setSessionSkill}
            />
          ))}
        </div>
      )}

      <SessionModal
        skill={sessionSkill}
        open={Boolean(sessionSkill)}
        onClose={() => setSessionSkill(null)}
        onSubmit={handleAddSession}
        submitting={submittingSession}
      />

      <EditSkillModal
        skill={editingSkill}
        open={Boolean(editingSkill)}
        onClose={() => setEditingSkill(null)}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(deletingSkill)}
        title="Eliminar skill"
        message={`¿Seguro que quieres eliminar "${deletingSkill?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeletingSkill(null)}
        loading={deleting}
      />
    </div>
  );
}
