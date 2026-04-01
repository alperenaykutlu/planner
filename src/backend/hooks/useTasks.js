import { useLocalStorage } from './useLocalStorage.js';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);

  const addTask = (data) => {
    const task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      reminded: false
    };
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id, patch) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, addTask, updateTask, deleteTask };
}
