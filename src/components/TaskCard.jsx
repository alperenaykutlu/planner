// components/TaskCard.jsx
import { useState } from 'react';
import { STATUS, STATUS_LABEL, STATUS_COLOR } from '../backend/shared/enum/list.js';

const STATUS_GRADIENT = {
  [STATUS.TODO]:      'linear-gradient(135deg, #3b82f6, #6366f1)',
  [STATUS.WAITING]:   'linear-gradient(135deg, #f59e0b, #f97316)',
  [STATUS.DONE]:      'linear-gradient(135deg, #10b981, #06b6d4)',
  [STATUS.CANCELLED]: 'linear-gradient(135deg, #6b7280, #4b5563)',
};

export function TaskCard({ task, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const handleStatusChange = (e) => {
    onUpdate(task.id, { status: e.target.value });
  };

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleString('tr-TR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const isOverdue =
    task.dueDate &&
    task.status !== STATUS.DONE &&
    task.status !== STATUS.CANCELLED &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="tc" style={{ '--status-color': STATUS_COLOR[task.status] }}>
      {/* Sol gradient şerit */}
      <div
        className="tc__strip"
        style={{ background: STATUS_GRADIENT[task.status] }}
      />

      <div className="tc__inner">
        {/* Üst satır: başlık + aksiyonlar */}
        <div className="tc__top">
          <button
            className="tc__expand"
            onClick={() => setExpanded(v => !v)}
            aria-label="Detay"
          >
            <span className={`tc__chevron ${expanded ? 'tc__chevron--open' : ''}`}>›</span>
          </button>

          <span className="tc__title" onClick={() => setExpanded(v => !v)}>
            {task.title}
          </span>

          <div className="tc__actions">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="tc__status"
              style={{ '--grad': STATUS_GRADIENT[task.status] }}
            >
              {Object.entries(STATUS_LABEL).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>

            <button
              className="tc__delete"
              onClick={() => onDelete(task.id)}
              title="Sil"
            >
              ×
            </button>
          </div>
        </div>

        {/* Açıklama özeti (her zaman görünür, kısa) */}
        {task.description && !expanded && (
          <p className="tc__preview" onClick={() => setExpanded(true)}>
            {task.description.length > 80
              ? task.description.slice(0, 80) + '…'
              : task.description}
          </p>
        )}

        {/* Genişletilmiş detay */}
        <div className={`tc__body ${expanded ? 'tc__body--open' : ''}`}>
          {task.description && (
            <p className="tc__desc">{task.description}</p>
          )}

          <div className="tc__meta">
            {task.dueDate && (
              <span className={`tc__due ${isOverdue ? 'tc__due--overdue' : ''}`}>
                📅 {formatDate(task.dueDate)}
                {isOverdue && <span className="tc__overdue-badge">Gecikti</span>}
              </span>
            )}

            {task.remindBefore > 0 && (
              <span className="tc__remind">
                🔔 {task.remindBefore} dk önce hatırlat
              </span>
            )}

            {task.reminded && (
              <span className="tc__reminded">✓ Bildirim gönderildi</span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .tc {
          position: relative;
          display: flex;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          margin-bottom: 10px;
          overflow: hidden;
          transition: transform .2s, box-shadow .2s, background .2s;
        }
        .tc:hover {
          transform: translateY(-2px) translateX(2px);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35),
                      0 0 0 1px var(--status-color, #6366f1)22;
        }

        .tc__strip {
          width: 4px;
          flex-shrink: 0;
          border-radius: 14px 0 0 14px;
          transition: width .2s;
        }
        .tc:hover .tc__strip { width: 6px; }

        .tc__inner {
          flex: 1;
          padding: 13px 16px;
          min-width: 0;
        }

        .tc__top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tc__expand {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          color: rgba(255,255,255,0.3);
          line-height: 1;
        }
        .tc__chevron {
          display: inline-block;
          font-size: 18px;
          transition: transform .25s cubic-bezier(.34,1.56,.64,1), color .2s;
        }
        .tc__chevron--open {
          transform: rotate(90deg);
          color: var(--status-color, #6366f1);
        }

        .tc__title {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .15s;
        }
        .tc__title:hover { color: #c7d2fe; }

        .tc__actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .tc__status {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: #f0f0ff;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          transition: all .2s;
        }
        .tc__status:hover {
          background: rgba(255,255,255,0.12);
          border-color: var(--status-color, #6366f1);
        }

        .tc__delete {
          background: none;
          border: none;
          color: rgba(255,255,255,0.25);
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s;
        }
        .tc__delete:hover {
          color: #ef4444;
          background: rgba(239,68,68,0.12);
        }

        /* Açıklama özeti */
        .tc__preview {
          margin-top: 6px;
          padding-left: 28px;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .15s;
        }
        .tc__preview:hover { color: rgba(255,255,255,0.55); }

        /* Detay alanı — CSS height animasyonu */
        .tc__body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .3s cubic-bezier(.4,0,.2,1),
                      opacity .25s, margin .3s;
          opacity: 0;
          margin-top: 0;
        }
        .tc__body--open {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 12px;
        }
        .tc__body > * { overflow: hidden; }

        .tc__desc {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          padding-left: 28px;
          margin-bottom: 10px;
        }

        .tc__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-left: 28px;
        }

        .tc__due {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .tc__due--overdue {
          color: #fca5a5;
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.25);
        }
        .tc__overdue-badge {
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 999px;
          letter-spacing: 0.3px;
        }

        .tc__remind {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 3px 10px;
          border-radius: 999px;
        }

        .tc__reminded {
          font-size: 12px;
          color: #6ee7b7;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          padding: 3px 10px;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}