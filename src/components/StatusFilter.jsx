// components/StatusFilter.jsx
import { STATUS, STATUS_LABEL, STATUS_COLOR } from '../backend/shared/enum/list.js';

const STATUS_GLOW = {
  [STATUS.TODO]:      'rgba(99,102,241,0.25)',
  [STATUS.WAITING]:   'rgba(245,158,11,0.25)',
  [STATUS.DONE]:      'rgba(16,185,129,0.25)',
  [STATUS.CANCELLED]: 'rgba(107,114,128,0.2)',
};

export function StatusFilter({ active, onChange }) {
  return (
    <div className="status-filter">
      {/* Tümü */}
      <button
        className={`status-filter__btn ${active === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
        style={active === null ? {
          borderColor: 'rgba(99,102,241,0.6)',
          background: 'rgba(99,102,241,0.14)',
          color: '#eeeeff',
          boxShadow: '0 0 14px rgba(99,102,241,0.2)',
        } : {}}
      >
        ✦ Tümü
      </button>

      {Object.entries(STATUS_LABEL).map(([val, label]) => (
        <button
          key={val}
          className={`status-filter__btn ${active === val ? 'active' : ''}`}
          onClick={() => onChange(val)}
          style={active === val ? {
            borderColor: STATUS_COLOR[val],
            color: STATUS_COLOR[val],
            background: `${STATUS_COLOR[val]}22`,
            boxShadow: `0 0 14px ${STATUS_GLOW[val]}`,
          } : {}}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6, height: 6,
              borderRadius: '50%',
              background: STATUS_COLOR[val],
              marginRight: 6,
              boxShadow: active === val ? `0 0 6px ${STATUS_COLOR[val]}` : 'none',
              transition: 'box-shadow .2s',
            }}
          />
          {label}
        </button>
      ))}
    </div>
  );
}