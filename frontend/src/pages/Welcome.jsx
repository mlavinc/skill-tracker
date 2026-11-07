import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import { useUser } from '../context/UserContext';
import { useUsers } from '../hooks/useUsers';

export default function Welcome() {
  const { user, selectUser } = useUser();
  const { users, loading, error, fetchUsers, createUser } = useUsers();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSelect = (nextUser) => {
    selectUser(nextUser);
    navigate('/dashboard');
  };

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      const created = await createUser(payload);
      selectUser(created);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="welcome-page">
      <section className="welcome-page__hero">
        <div className="welcome-page__brand"><span>ST</span> Skill Tracker</div>
        <div>
          <span className="eyebrow eyebrow--on-dark">Aprender también es avanzar</span>
          <h1>Convierte la práctica en progreso visible.</h1>
          <p>Elige una habilidad, registra el esfuerzo y mantén claro qué sigue.</p>
        </div>
        <div className="welcome-page__steps" aria-label="Cómo funciona">
          <span>01 · Elige</span><span>02 · Practica</span><span>03 · Avanza</span>
        </div>
      </section>

      <section className="welcome-page__content">
        <div className="welcome-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">Entrar</span>
              <h2>Selecciona tu perfil</h2>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowCreate((value) => !value)}>
              {showCreate ? 'Volver a perfiles' : 'Crear perfil'}
            </button>
          </div>

          {showCreate ? (
            <UserForm onSubmit={handleCreate} submitting={submitting} />
          ) : (
            <>
              {loading && <LoadingSpinner label="Cargando perfiles..." />}
              {!loading && error && <ErrorMessage message={error} onRetry={fetchUsers} />}
              {!loading && !error && users.length === 0 && (
                <EmptyState title="Aún no hay perfiles" description="Crea el primero para comenzar." />
              )}
              {!loading && !error && users.length > 0 && (
                <div className="user-grid">
                  {users.map((item) => <UserCard key={item.id} user={item} onSelect={handleSelect} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
