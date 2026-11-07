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
          <span className="eyebrow">Nueva</span>
          <h1>Crear habilidad</h1>
          <p>Define lo esencial. Podrás registrar la práctica después.</p>
        </div>
      </section>

      <div className="page-form-container">
        <SkillForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </div>
  );
}
