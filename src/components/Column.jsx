import TaskCard from './TaskCard';
import './Column.css';


function Column({ title, status, tasks, onDrop, onDragOver, onDragLeave, onTouchStart }) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      className="bg-light rounded p-3 h-100 board-column"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      data-status={status}
    >
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h5 className="mb-0 fw-semibold text-uppercase">{title}</h5>
        <span className="badge bg-secondary">{filteredTasks.length}</span>
      </div>
      <div className="d-flex flex-column" style={{ minHeight: '300px' }}>
        {filteredTasks.length === 0 ? (
          <div className="text-center text-muted p-4 fst-italic">No tasks</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="mb-2">
              <TaskCard
                task={task}
                isDraggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('taskId', task.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onTouchStart={(e) => {
                  if (onTouchStart) {
                    onTouchStart(e, task.id);
                  }
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Column;

