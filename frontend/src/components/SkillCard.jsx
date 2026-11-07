import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { formatDate, statusClass } from '../utils/format';

export default function SkillCard({ skill, onEdit, onDelete, onAddSession }) {
  return (
    <article className="skill-card">
      <div className="skill-card__header">
        <div>
          <span className="skill-card__category">{skill.categoria}</span>
          <h3>{skill.nombre}</h3>
        </div>
        <span className={`badge ${statusClass(skill.estado)}`}>
          {skill.estado || 'Activa'}
        </span>
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
            Registrar práctica
          </button>
        )}
        <Link to={`/skills/${skill.id}`} className="btn btn--ghost btn--sm">
          Abrir
        </Link>
        {(onEdit || onDelete) && (
          <div className="skill-card__manage" aria-label="Administrar habilidad">
            {onEdit && <button type="button" onClick={() => onEdit(skill)}>Editar</button>}
            {onDelete && (
              <button type="button" className="text-danger" onClick={() => onDelete(skill)}>
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
