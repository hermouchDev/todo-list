import { useState } from 'react';
import useTaskStore from '../store/useTaskStore';
import './TasksInput.css';

/**
 * TasksInput component - input field and button to add new tasks
 * Styled with purple theme
 */
function TasksInput() {
  const [inputValue, setInputValue] = useState('');
  const addTask = useTaskStore((state) => state.addTask);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue);
      setInputValue(''); // Clear input after adding
    }
  };

  return (
    <div className="tasks-input-section">
      <p className="input-prompt text-center mb-3">Let's get things done! 👋 What's your next task ?</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control task-input"
            placeholder="Enter what you want to do..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Task title"
          />
          <button className="btn btn-add" type="submit">
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}

export default TasksInput;
