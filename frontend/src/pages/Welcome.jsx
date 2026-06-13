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

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSelect = (user) => {
    selectUser(user);
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
    <div className="welcome-page">
      <div className="welcome-page__hero">
        <span className="welcome-page__logo">◆</span>
        <h1>Skill Tracker</h1>
        <p>Selecciona tu perfil o crea uno nuevo para comenzar.</p>
      </div>

      <div className="welcome-page__content">
        <section className="welcome-section">
          <div className="section-header">
            <h2>Usuarios existentes</h2>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setShowCreate((prev) => !prev)}
            >
              {showCreate ? 'Ocultar formulario' : '+ Crear usuario'}
            </button>
          </div>

          {loading && <LoadingSpinner label="Cargando usuarios..." />}
          {!loading && error && <ErrorMessage message={error} onRetry={fetchUsers} />}

          {!loading && !error && users.length === 0 && (
            <EmptyState
              icon="👋"
              title="No hay usuarios"
              description="Crea el primer usuario para empezar a trackear skills."
            />
          )}

          {!loading && !error && users.length > 0 && (
            <div className="user-grid">
              {users.map((user) => (
                <UserCard key={user.id} user={user} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </section>

        {showCreate && (
          <section className="welcome-section">
            <UserForm onSubmit={handleCreate} submitting={submitting} />
          </section>
        )}
      </div>
    </div>
  );
}
