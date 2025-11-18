import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import useTaskStore from '../store/useTaskStore';
import TasksInput from '../components/TasksInput';
import TaskCard from '../components/TaskCard';
import './Tasks.css';

/**
 * Tasks Page - displays all tasks with ability to add new tasks
 * Includes edit, delete, clear list, sort, and footer
 */
function Tasks() {
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);
  const sortType = useTaskStore((state) => state.sortType);
  const setSortType = useTaskStore((state) => state.setSortType);
  const clearAllTasks = useTaskStore((state) => state.clearAllTasks);

  // Get sorted tasks based on sort type
  const sortedTasks = useMemo(() => {
    const tasksCopy = [...tasks];
    
    switch (sortType) {
      case 'description':
        // Sort alphabetically by title
        return tasksCopy.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
      case 'packed':
        {
          // Sort by status order: todo -> inprogress -> done
          const statusOrder = { todo: 1, inprogress: 2, done: 3 };
          return tasksCopy.sort((a, b) => {
            return statusOrder[a.status] - statusOrder[b.status];
          });
        }
      case 'input':
      default:
        // Sort by input order (original order, by ID)
        return tasksCopy.sort((a, b) => {
          return parseInt(a.id) - parseInt(b.id);
        });
    }
  }, [tasks, sortType]);

  // Calculate statistics (completed = status === 'done')
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [tasks]);

  // Handle clear list
  const handleClearList = () => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      clearAllTasks();
    }
  };

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-center w-100">
          <h1 className="page-title mb-0">TO-DO LIST</h1>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate('/board')}
          >
            Go to Board
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="container-content">
        <TasksInput />

        {/* Tasks List */}
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted">No tasks yet. Add a task to get started!</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </div>

      {/* Footer with Statistics and Control Buttons */}
      <div className="page-footer">
        {/* Top Section - Lighter lavender with buttons */}
        {tasks.length > 0 && (
          <div className="footer-top">
            <div className="footer-control-buttons">
              {/* Sort Select */}
              <select
                className="form-select sort-select-control"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                aria-label="Sort tasks"
              >
                <option value="input">SORT BY INPUT ORDER</option>
                <option value="description">SORT BY DESCRIPTION</option>
                <option value="packed">SORT BY PACKED STATUS</option>
              </select>
              <button className="btn btn-control" onClick={handleClearList}>
                CLEAR LIST
              </button>
            </div>
          </div>
        )}
        {/* Bottom Section - Darker lavender with text */}
        <div className="footer-bottom">
          <p className="footer-text">
            {tasks.length === 0 ? (
              'Start adding some tasks to your ToDo list 😊'
            ) : stats.completed === stats.total ? (
              'Awesome! You crushed your ToDo list! 💪'
            ) : (
              <>
                You have {stats.total} task{stats.total !== 1 ? 's' : ''} in your ToDo List, And you
                already pick {stats.completed} ({stats.percentage}%)
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
