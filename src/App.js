import Logo from "./Components/Logo";
import Form from "./Components/Form";
import PackingList from "./Components/PackingList";
import Stats from "./Components/Stats";
import { useState, useEffect } from "react";

const API_URL = 'http://localhost/todo-list/index.php'; // Adjust to your server path

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            
            if (result.success) {
                // Map PHP data to React format
                const mappedItems = result.data.map(task => ({
                    id: task.id,
                    description: task.title,
                    packed: task.done
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddItem(newItem) {
        try {
            const formData = new FormData();
            formData.append('action', 'new');
            formData.append('title', newItem.description);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Refresh the list
                fetchTasks();
            } else {
                alert(`⚠️ ${result.message || 'Error adding task'} ❌`);
            }
        } catch (error) {
            console.error('Error adding task:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                alert('⚠️ Cannot connect to server. Please check:\n1. PHP server is running\n2. API_URL is correct\n3. Database is set up');
            } else {
                alert(`⚠️ Error adding task: ${error.message}`);
            }
        }
    }

    async function handleDeletItem(id) {
        const confirmed = window.confirm('Are you sure you want to delete the task 🤔 ?');
        if (!confirmed) return;

        try {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', id);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                fetchTasks(); // Refresh the list
            } else {
                alert('Error deleting task: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task. Please try again.');
        }
    }

    async function handleToggleItem(id) {
        try {
            const formData = new FormData();
            formData.append('action', 'toggle');
            formData.append('id', id);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                fetchTasks(); // Refresh the list
            } else {
                alert('Error updating task: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task. Please try again.');
        }
    }

    async function handleClearList() {
        const confirmed = window.confirm('Are you sure you want to delete all tasks 🤔 ?');
        if (!confirmed) return;

        // You'll need to add a 'clear' action in your PHP backend
        // For now, delete each item individually
        try {
            for (const item of items) {
                const formData = new FormData();
                formData.append('action', 'delete');
                formData.append('id', item.id);
                await fetch(API_URL, { method: 'POST', body: formData });
            }
            fetchTasks();
        } catch (error) {
            console.error('Error clearing tasks:', error);
        }
    }

    async function handleEditItem(id, newDescription) {
        try {
            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('id', id);
            formData.append('title', newDescription);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                fetchTasks(); // Refresh the list
            } else {
                alert('Error updating task: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task. Please try again.');
        }
    }

    if (loading) {
        return <div className="app">Loading...</div>;
    }

    return (
        <div className="app">
            <Logo />
            <Form onAddItem={handleAddItem} />
            <PackingList 
                items={items} 
                onDeletItem={handleDeletItem} 
                onToggleItem={handleToggleItem} 
                onEditItem={handleEditItem} 
                clearList={handleClearList} 
            />
            <Stats items={items} />
        </div>
    );
}

export default App;