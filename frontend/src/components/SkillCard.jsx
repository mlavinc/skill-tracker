import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { formatDate, priorityClass, statusClass } from '../utils/format';

export default function SkillCard({ skill, onEdit, onDelete, onAddSession }) {
  return (
    <article className="skill-card">
      <div className="skill-card__header">
        <div>
          <h3>{skill.nombre}</h3>
          <span className="skill-card__category">{skill.categoria}</span>
        </div>
        <div className="skill-card__badges">
          <span className={`badge ${priorityClass(skill.prioridad)}`}>
            {skill.prioridad || 'Media'}
          </span>
          <span className={`badge ${statusClass(skill.estado)}`}>
            {skill.estado || 'Activo'}
          </span>
        </div>
      </div>

      <ProgressBar value={skill.progreso} />

      <p className="skill-card__meta">
        Última práctica: {formatDate(skill.ultima_practica)}
      </p>

      <div className="skill-card__actions">
        {onAddSession && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onAddSession(skill)}
          >
            + Registrar sesión
          </button>
        )}
        <Link to={`/skills/${skill.id}`} className="btn btn--ghost btn--sm">
          Ver detalle
        </Link>
        {onEdit && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => onEdit(skill)}
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(skill)}
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
}
