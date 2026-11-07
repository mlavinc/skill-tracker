import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { formatDate, statusClass } from '../utils/format';

export default function SkillCard({ skill, onEdit, onDelete, onAddSession }) {
  return (
    <article className="skill-card">
      <div className="skill-card__identity">
        <span className="skill-card__category">{skill.categoria}</span>
        <Link to={`/skills/${skill.id}`} className="skill-card__title">
          {skill.nombre}
        </Link>
        <span className="skill-card__meta">Última práctica: {formatDate(skill.ultima_practica)}</span>
      </div>

      <div className="skill-card__progress">
        <ProgressBar value={skill.progreso} />
      </div>

      <span className={`badge ${statusClass(skill.estado)}`}>
        {skill.estado || 'Activa'}
      </span>

      <div className="skill-card__actions">
        {onAddSession && (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => onAddSession(skill)}>
            Practicar
          </button>
        )}
        <Link to={`/skills/${skill.id}`} className="btn btn--ghost btn--sm">Abrir</Link>
        {(onEdit || onDelete) && (
          <div className="skill-card__manage" aria-label="Administrar habilidad">
            {onEdit && <button type="button" onClick={() => onEdit(skill)}>Editar</button>}
            {onDelete && <button type="button" className="text-danger" onClick={() => onDelete(skill)}>Eliminar</button>}
          </div>
        )}
      </div>
    </article>
  );
}
