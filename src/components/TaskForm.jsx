// components/TaskForm.jsx
import { useState } from 'react';
import { STATUS, STATUS_LABEL, STATUS_COLOR } from '../backend/shared/enum/list.js';

const EMPTY = {
  title:        '',
  description:  '',
  status:       STATUS.TODO,
  dueDate:      '',
  remindBefore: 0,
};

const STATUS_GRADIENT = {
  [STATUS.TODO]:      'linear-gradient(135deg,#6366f1,#8b5cf6)',
  [STATUS.WAITING]:   'linear-gradient(135deg,#f59e0b,#f97316)',
  [STATUS.DONE]:      'linear-gradient(135deg,#10b981,#06b6d4)',
  [STATUS.CANCELLED]: 'linear-gradient(135deg,#4b5563,#374151)',
};

export function TaskForm({ onSave, onClose, initialData = null }) {
  const [form, setForm] = useState(
    initialData
      ? { ...initialData, dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 16) : '' }
      : EMPTY
  );
  const [error, setError] = useState('');

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Başlık zorunlu.'); return; }
    onSave({
      ...form,
      title:        form.title.trim(),
      description:  form.description.trim(),
      remindBefore: Number(form.remindBefore),
      dueDate:      form.dueDate ? new Date(form.dueDate).toISOString() : null,
    });
  };

  return (
    <>
      {/* ── Overlay ── */}
      <div className="modal-overlay" onClick={onClose} />

      {/* ── Modal ── */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 201,
          width: '100%',
          maxWidth: 500,
          padding: '0 16px',
          animation: 'slideUp .24s cubic-bezier(.34,1.1,.64,1)',
        }}
      >
        <div style={{
          background: '#13132a',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          padding: '30px 28px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* üst çizgi */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: STATUS_GRADIENT[form.status],
            transition: 'background .3s',
            borderRadius: '24px 24px 0 0',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
            <h2 style={{
              fontSize: 19, fontWeight: 800, letterSpacing: -0.3,
              background: 'linear-gradient(135deg,#fff 30%,#06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {initialData ? '✏️ Görevi Düzenle' : '✦ Yeni Görev'}
            </h2>
            <button onClick={onClose} style={{
              width: 34, height: 34,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(238,238,255,0.4)',
              borderRadius: 10, fontSize: 20,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.color='#eeeeff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(238,238,255,0.4)'; }}
            >×</button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Başlık */}
              <Field label="BAŞLIK *">
                <Input
                  type="text"
                  value={form.title}
                  onChange={set('title')}
                  placeholder="Görev başlığı…"
                  autoFocus
                />
              </Field>

              {/* Açıklama */}
              <Field label="AÇIKLAMA">
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="İsteğe bağlı not ekle…"
                  rows={3}
                  style={inputStyle}
                />
              </Field>

              {/* Durum */}
              <Field label="DURUM">
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    width: 8, height: 8, borderRadius: '50%',
                    background: STATUS_COLOR[form.status],
                    boxShadow: `0 0 8px ${STATUS_COLOR[form.status]}`,
                    pointerEvents: 'none',
                    transition: 'background .2s, box-shadow .2s',
                  }} />
                  <select
                    value={form.status}
                    onChange={set('status')}
                    style={{ ...inputStyle, paddingLeft: 28 }}
                  >
                    {Object.entries(STATUS_LABEL).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </Field>

              {/* Tarih */}
              <Field label="TARİH & SAAT">
                <Input
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={set('dueDate')}
                />
              </Field>

              {/* Hatırlatıcı */}
              {form.dueDate && (
                <Field label="HATIRLATICI">
                  <select value={form.remindBefore} onChange={set('remindBefore')} style={inputStyle}>
                    <option value={0}>Tam saatinde</option>
                    <option value={5}>5 dakika önce</option>
                    <option value={10}>10 dakika önce</option>
                    <option value={15}>15 dakika önce</option>
                    <option value={30}>30 dakika önce</option>
                    <option value={60}>1 saat önce</option>
                    <option value={1440}>1 gün önce</option>
                  </select>
                </Field>
              )}

              {/* Hata */}
              {error && (
                <p style={{
                  color: '#fb7185', fontSize: 13, fontWeight: 500,
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.22)',
                  padding: '9px 14px', borderRadius: 10,
                }}>⚠ {error}</p>
              )}

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: 10,
                marginTop: 6, paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <button
                  type="button" onClick={onClose}
                  style={{
                    padding: '9px 22px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(238,238,255,0.7)',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    transition: 'all .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                >
                  İptal
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '9px 26px', borderRadius: 10,
                    background: STATUS_GRADIENT[form.status],
                    border: 'none', color: '#fff',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: `0 4px 18px ${STATUS_COLOR[form.status]}55`,
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 28px ${STATUS_COLOR[form.status]}77`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 4px 18px ${STATUS_COLOR[form.status]}55`; }}
                >
                  {initialData ? '✓ Kaydet' : '+ Ekle'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.4);
          cursor: pointer;
        }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(1) opacity(0.8);
        }
        textarea { resize: vertical; }
      `}</style>
    </>
  );
}

/* ── Yardımcı bileşenler ── */
const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#eeeeff',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  colorScheme: 'dark',
  transition: 'border-color .2s, background .2s, box-shadow .2s',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,255,0.3)', letterSpacing: '0.7px' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        ...(focused ? {
          borderColor: '#6366f1',
          background: 'rgba(255,255,255,0.09)',
          boxShadow: '0 0 0 3px rgba(99,102,241,0.18)',
        } : {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}