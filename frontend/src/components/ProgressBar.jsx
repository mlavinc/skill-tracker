import { clampProgress } from '../utils/format';

export default function ProgressBar({ value, showLabel = true }) {
  const progress = clampProgress(value);

  return (
    <div className="progress-bar">
      {showLabel && (
        <div className="progress-bar__header">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="progress-bar__track" aria-hidden="true">
        <div
          className="progress-bar__fill"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
