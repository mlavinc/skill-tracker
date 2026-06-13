import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillForm from '../components/SkillForm';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';

export default function NewSkill() {
  const { user } = useUser();
  const { createSkill } = useSkills(user?.id);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await createSkill(payload);
      navigate('/skills');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Nueva Skill</h1>
          <p>Registra una nueva habilidad que quieras desarrollar.</p>
        </div>
      </section>

      <div className="page-form-container">
        <SkillForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </div>
  );
}
