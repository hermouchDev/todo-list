import { create } from 'zustand';
import { playCompletionSound } from '../utils/notification'; 

const API_URL = 'http://localhost/todo-list/api/index.php'; // adjust if served elsewhere

const useTaskStore = create((set, get) => ({
  tasks: [],
  sortType: 'input',
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      set({ tasks: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addTask: async (title) => {
    const payload = { title };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to add task');
    const newTask = await res.json();
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTaskStatus: async (id, status) => {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) throw new Error('Failed to update task');
    const updated = await res.json();
    if (status === 'done') {
      playCompletionSound();
    }
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }));
  },

  editTask: async (id, title) => {
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title }),
      });
      if (!res.ok) throw new Error('Failed to edit task');
      const updated = await res.json();
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
      }));
    } catch (err) {
      console.error('Error editing task:', err);
      // Optionally show error to user
    }
  },

  deleteTask: async (id) => {
    const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  clearAllTasks: async () => {
    const { tasks, deleteTask } = get();
    await Promise.all(tasks.map((task) => deleteTask(task.id)));
  },

  setSortType: (sortType) => set({ sortType }),
}));

export default useTaskStore;