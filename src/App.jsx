import { useState } from 'react';
import { useTasks } from './backend/hooks/useTasks.js';
import { useNotifications } from './backend/hooks/useNotifications.js';
import { TabView } from './components/TabView.jsx';
import { TaskList } from './components/TaskList.jsx';
import { CalendarGrid } from './components/CalendarGrid.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { StatusFilter } from './components/StatusFilter.jsx';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, markReminded } = useTasks();
  const [activeStatus, setActiveStatus] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const safeTasks = tasks || [];
  useNotifications(safeTasks, markReminded);

  const filtered = activeStatus
    ? safeTasks.filter(t => t.status === activeStatus)
    : safeTasks;

  return (
    <div className="app">
      <header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1>Planlayıcı</h1>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3px' }}>
            {safeTasks.length} görev · {safeTasks.filter(t => t.status === 'yapılacak').length} bekliyor
          </span>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '9px 20px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
        >
          + Görev Ekle
        </button>
      </header>

      <StatusFilter active={activeStatus} onChange={setActiveStatus} />

      <TabView
        tabs={['Liste', 'Takvim']}
        panels={[
          <TaskList key="list" tasks={filtered} onUpdate={updateTask} onDelete={deleteTask} />,
          <CalendarGrid key="calendar" tasks={filtered} onUpdate={updateTask} />,
        ]}
      />

      {showForm && (
        <TaskForm
          onSave={(data) => { addTask(data); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}