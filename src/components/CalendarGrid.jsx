// components/CalendarGrid.jsx
import { useState } from 'react';
import { STATUS_COLOR } from '../backend/shared/enum/list.js';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  // Pazartesi başlangıçlı: 0=Pzt ... 6=Paz
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS   = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',
];

export function CalendarGrid({ tasks, onUpdate }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth  = getDaysInMonth(year, month);
  const firstWeekday = getFirstDayOfMonth(year, month);

  // Görevleri gün bazında grupla
  const tasksByDay = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const d = new Date(task.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
    }
    return acc;
  }, {});

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const selectedTasks = selectedDay ? (tasksByDay[selectedDay] ?? []) : [];

  // Grid hücreleri: boş + dolu günler
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="calendar">
      {/* Navigasyon */}
      <div className="calendar__nav">
        <button onClick={prevMonth}>‹</button>
        <h2>{MONTHS[month]} {year}</h2>
        <button onClick={nextMonth}>›</button>
      </div>

      {/* Haftanın günleri */}
      <div className="calendar__weekdays">
        {WEEKDAYS.map(d => (
          <div key={d} className="calendar__weekday">{d}</div>
        ))}
      </div>

      {/* Günler */}
      <div className="calendar__grid">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="calendar__cell--empty" />;

          const dayTasks = tasksByDay[day] ?? [];
          const selected = selectedDay === day;

          return (
            <div
              key={day}
              className={[
                'calendar__cell',
                isToday(day)  ? 'today'    : '',
                selected      ? 'selected' : '',
                dayTasks.length ? 'has-tasks' : '',
              ].join(' ')}
              onClick={() => setSelectedDay(selected ? null : day)}
            >
              <span className="calendar__day-num">{day}</span>

              {/* Her görev için renkli nokta */}
              <div className="calendar__dots">
                {dayTasks.slice(0, 3).map(t => (
                  <span
                    key={t.id}
                    className="calendar__dot"
                    style={{ background: STATUS_COLOR[t.status] }}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <span className="calendar__dot-more">+{dayTasks.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seçili günün görevleri */}
      {selectedDay && (
        <div className="calendar__day-detail">
          <h3>
            {selectedDay} {MONTHS[month]} — {selectedTasks.length} görev
          </h3>

          {selectedTasks.length === 0 ? (
            <p className="empty-state">Bu gün için görev yok.</p>
          ) : (
            selectedTasks.map(task => (
              <div
                key={task.id}
                className="calendar__task-row"
                style={{ borderLeft: `3px solid ${STATUS_COLOR[task.status]}` }}
              >
                <span className="calendar__task-time">
                  {new Date(task.dueDate).toLocaleTimeString('tr-TR', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                <span className="calendar__task-title">{task.title}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}