import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Tasks from './pages/Tasks';
import Board from './pages/Board';
import useTaskStore from './store/useTaskStore';
import './App.css';

function App() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Tasks />} />
          <Route path="board" element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;