import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import Column from '../components/Column';
import './Board.css';

function Board() {
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const dragRef = useRef(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [tasks]);

  // Handle touch start for mobile
  const handleTouchStart = useCallback((e, taskId) => {
    e.preventDefault();
    setDraggedTaskId(taskId);
    dragRef.current = e.currentTarget;
    e.currentTarget.style.opacity = '0.5';
  }, []);

  // Handle touch move for mobile - needs to be on document level
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!draggedTaskId) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const column = elementBelow?.closest('.board-column');
      
      if (column) {
        // Remove drag-over from all columns
        document.querySelectorAll('.board-column').forEach(col => {
          col.classList.remove('drag-over');
        });
        column.classList.add('drag-over');
      }
    };

    const handleTouchEnd = (e) => {
      if (!draggedTaskId || !dragRef.current) return;
      
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const column = elementBelow?.closest('.board-column');
      
      if (column) {
        const targetStatus = column.getAttribute('data-status');
        if (targetStatus) {
          updateTaskStatus(draggedTaskId, targetStatus);
        }
      }
      
      // Cleanup
      document.querySelectorAll('.board-column').forEach(col => {
        col.classList.remove('drag-over');
      });
      if (dragRef.current) {
        dragRef.current.style.opacity = '1';
      }
      setDraggedTaskId(null);
      dragRef.current = null;
    };

    if (draggedTaskId) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [draggedTaskId, updateTaskStatus]);

  // Handle drag over event to allow drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.classList.contains('drag-over')) {
      e.currentTarget.classList.add('drag-over');
    }
  }, []);

  // Handle drag leave event
  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  }, []);

  // Handle drop event - update task status
  const handleDrop = useCallback(
    (e, targetStatus) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');

      const taskId = e.dataTransfer.getData('taskId');
      if (taskId) {
        updateTaskStatus(taskId, targetStatus);
      }
    },
    [updateTaskStatus]
  );

  return (
    <div className="board-page">
      {/* Header */}
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-center w-100">
          <h1 className="page-title mb-0">BOARD VIEW</h1>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate('/')}
          >
            Back to Tasks
          </button>
        </div>
      </div>

      {/* Board Container */}
      <div className="container-content">
        <div className="board-container">
          <div className="row g-3">
            <div className="col-md-4 d-flex">
              <Column
                title="TO DO"
                status="todo"
                tasks={tasks}
                onDrop={(e) => handleDrop(e, 'todo')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onTouchStart={(e, taskId) => handleTouchStart(e, taskId)}
              />
            </div>
            <div className="col-md-4 d-flex">
              <Column
                title="IN PROGRESS"
                status="inprogress"
                tasks={tasks}
                onDrop={(e) => handleDrop(e, 'inprogress')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onTouchStart={(e, taskId) => handleTouchStart(e, taskId)}
              />
            </div>
            <div className="col-md-4 d-flex">
              <Column
                title="DONE"
                status="done"
                tasks={tasks}
                onDrop={(e) => handleDrop(e, 'done')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onTouchStart={(e, taskId) => handleTouchStart(e, taskId)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Statistics */}
      <div className="page-footer">
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

export default Board;