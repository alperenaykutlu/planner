import { useEffect, useRef } from 'react';
import { notificationService } from '../services/notification.js';
export function useNotifications(tasks, onRemind) {
  const workerRef = useRef(null);

  useEffect(() => {
    notificationService.requestPermission();

    workerRef.current = new Worker(
      new URL('../worker/reminderWorker.js', import.meta.url)
    );

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'REMIND') {
        notificationService.send(`🔔 ${e.data.taskTitle}`, {
          body: 'Hatırlatıcı zamanı geldi!',
        });
        onRemind(e.data.taskID);
      }
    };

    return () => workerRef.current?.terminate();
  }, []);                         // worker bir kez kurulur

  useEffect(() => {
    workerRef.current?.postMessage({ type: 'SYNC_TASKS', tasks });
  }, [tasks]);                    // tasks değişince worker'a ilet
}