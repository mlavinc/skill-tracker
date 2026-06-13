import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import EditSkillModal from '../components/EditSkillModal';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Mis Skills</h1>
          <p>Gestiona todas tus habilidades de aprendizaje.</p>
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
          description="Ve a Nueva Skill para crear tu primera habilidad."
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
            />
          ))}
        </div>
      )}

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
