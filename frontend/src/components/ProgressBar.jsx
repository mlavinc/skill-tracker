import { clampProgress } from '../utils/format';

export default function ProgressBar({ value, showLabel = true, tone = 'default' }) {
  const progress = clampProgress(value);

  return (
    <div className={`progress-bar progress-bar--${tone}`}>
      {showLabel && (
        <div className="progress-bar__header">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
      )}
      <div
        className="progress-bar__track"
        role="progressbar"
        aria-label="Progreso"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
