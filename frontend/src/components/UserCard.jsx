export default function UserCard({ user, onSelect }) {
  return (
    <button
      type="button"
      className="user-card"
      onClick={() => onSelect(user)}
      style={{ '--user-color': user.color || '#6c8cff' }}
    >
      <span className="user-card__avatar" aria-hidden="true">
        {user.nombre.charAt(0).toUpperCase()}
      </span>
      <span className="user-card__name">{user.nombre}</span>
      <span className="user-card__color" aria-label={`Color ${user.color}`} />
    </button>
  );
}
