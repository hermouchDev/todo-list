import { useState, useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import './TaskCard.css';

/**
 * TaskCard component - displays a single task with status select, edit, and delete buttons
 * Supports both interactive mode (Tasks page) and draggable mode (Board page)
 */
function TaskCard({ task, isDraggable = false, onDragStart, onTouchStart, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const editTask = useTaskStore((state) => state.editTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  // Check if task is completed (status === 'done')
  const isCompleted = task.status === 'done';

  // Update editValue when task title changes (but not when editing)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(task.title);
    }
  }, [task.title, isEditing]);

  // Handle status change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateTaskStatus(task.id, newStatus);
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  // Handle edit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle save edit
  const handleSave = () => {
    if (editValue.trim()) {
      editTask(task.id, editValue);
      setIsEditing(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  // Handle key press in edit input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return null;
    }
  };

  // Board view (draggable) - display with timestamps
  if (isDraggable) {
    return (
      <div
        className={`task-item draggable ${isCompleted ? 'task-completed' : ''}`}
        draggable={true}
        onDragStart={onDragStart || (() => {})}
        onTouchStart={(e) => {
          if (onTouchStart) {
            onTouchStart(e, task.id);
          }
        }}
        data-task-id={task.id}
      >
        <div className="board-task-content">
          <span className="task-title">
            {task.title}
          </span>
          {/* Timestamps display - Board page only */}
          <div className="task-timestamps">
            {task.createdAt && (
              <span className="timestamp timestamp-created" title="Created">
                Created: {formatTimestamp(task.createdAt)}
              </span>
            )}
            {task.inProgressAt && (
              <span className="timestamp timestamp-inprogress" title="Started">
                Started: {formatTimestamp(task.inProgressAt)}
              </span>
            )}
            {task.doneAt && (
              <span className="timestamp timestamp-done" title="Completed">
                Completed: {formatTimestamp(task.doneAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tasks page view (interactive with edit/delete and status select)
  return (
    <div className="task-item">
      <div className="task-item-content">
        {/* Task Title or Edit Input */}
        <div className="task-title-wrapper">
          {isEditing ? (
            <input
              type="text"
              className="form-control form-control-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          ) : (
            <span
              className={`task-title ${isCompleted ? 'completed' : ''}`}
              onDoubleClick={handleEdit}
            >
              {task.title}
            </span>
          )}
        </div>

        {/* Status Select and Action Buttons */}
        {!isEditing && (
          <div className="task-controls">
            {/* Status Select Dropdown */}
            <div className="status-select-wrapper">
              <select
                className={`form-select form-select-sm status-select status-select-${task.status}`}
                value={task.status}
                onChange={handleStatusChange}
                aria-label="Change task status"
              >
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="task-actions d-flex gap-2">
              <button
                className="btn btn-sm btn-link p-0 edit-btn"
                onClick={handleEdit}
                aria-label="Edit task"
                title="Edit task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-5-1.207L11 5.793V4.5z" />
                </svg>
              </button>
              <button
                className="btn btn-sm btn-link p-0 delete-btn"
                onClick={handleDelete}
                aria-label="Delete task"
                title="Delete task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
