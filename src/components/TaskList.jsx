// components/TaskList.jsx
import { useState } from 'react';
import { TaskCard } from './TaskCard.jsx';
import { TaskForm } from './TaskForm.jsx';
const SORT_OPTIONS = {
  dueDate:   'Tarihe göre',
  createdAt: 'Oluşturulma',
  title:     'İsme göre',
};

export function TaskList({ tasks, onUpdate, onDelete }) {
  const [sortBy,   setSortBy]   = useState('dueDate');
  const [editTask, setEditTask] = useState(null);

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title, 'tr');

    const aVal = a[sortBy] ? new Date(a[sortBy]).getTime() : Infinity;
    const bVal = b[sortBy] ? new Date(b[sortBy]).getTime() : Infinity;
    return aVal - bVal;
  });

  const handleEdit = (task) => setEditTask(task);

  const handleEditSave = (data) => {
    onUpdate(editTask.id, data);
    setEditTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Görev yok.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list__toolbar">
        <label>
          Sırala:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {Object.entries(SORT_OPTIONS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </label>
        <span className="task-list__count">{tasks.length} görev</span>
      </div>

      {sorted.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={handleEdit}
        />
      ))}

      {editTask && (
        <TaskForm
          initialData={editTask}
          onSave={handleEditSave}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
}