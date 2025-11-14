# Todo List (React)

## Overview

Interactive todo list built in React with a modern, responsive UI. Users can add, edit, mark as done, and delete tasks. The layout adapts across devices, displaying each task vertically with intuitive icons and hover feedback. Styling uses a soft purple gradient theme and Bootstrap utilities for spacing and alignment.

An optional PHP + MySQL backend is provided for persisting tasks; the app can also run in purely client-side mode with in-memory state.

## Features

- Add tasks with uniqueness checks to prevent duplicates
- Toggle task completion and visualize it with strike-through styling
- Inline edit and delete controls with icon buttons
- Responsive layout: checkbox top-center, text centered, actions at bottom on small screens
- Hover effects for better interaction cues
- Optional persistence with PHP API and MySQL database

## Tech Stack

- React (create-react-app)
- Bootstrap 5 utilities
- Custom CSS
- Optional backend: PHP 8+, MySQL 5.7+/8.x

## Frontend Structure

The React application follows a component-based architecture:

```
src/
├── index.js              ← Entry point, renders App component
├── index.css             ← Global styles and responsive design
├── App.js                ← Main application component (state management)
└── Components/
    ├── Logo.js           ← Header logo component
    ├── Form.js           ← Task input form component
    ├── PackingList.js    ← Task list display component
    └── Stats.js          ← Statistics component (task count)
```

### Component Overview

1. **`App.js`** - Main container component
   - Manages application state (`items` array)
   - Handles all CRUD operations (add, edit, delete, toggle)
   - Coordinates communication between components
   - Can be configured to use PHP backend via fetch API

2. **`Components/Logo.js`** - Header component
   - Displays the application title/logo
   - Styled with gradient background

3. **`Components/Form.js`** - Task input form
   - Controlled input for new task creation
   - Prevents duplicate tasks
   - Uses React state for form management
   - Calls `onAddItem` callback from parent

4. **`Components/PackingList.js`** - Task list component
   - Displays all tasks in a responsive grid/list
   - Contains `Item` sub-component for individual tasks
   - Handles sorting (by input order, description, or completion status)
   - Includes edit and delete icon buttons
   - Responsive layout: vertical stack on mobile, horizontal on desktop

5. **`Components/Stats.js`** - Statistics component
   - Shows total number of tasks
   - Displays completion percentage

### State Management

- **Local State**: Uses React `useState` hook for component-level state
- **Props**: Data flows down from `App.js` to child components
- **Callbacks**: Child components communicate up via callback functions
- **Optional Backend**: Can integrate with PHP backend using `useEffect` and `fetch`

### Styling

- **`index.css`**: Global styles, responsive breakpoints, color scheme
- **Bootstrap 5**: Utility classes for layout and responsive design
- **Custom CSS**: Purple gradient theme, hover effects, animations

## Getting Started (Frontend Only)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm start
   ```
3. Open http://localhost:3000/ in your browser.

The app will store tasks in memory for the current session.

## Optional: PHP + MySQL Backend

To persist tasks, connect the React app to the provided PHP backend.

### Database Setup

```sql
CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;

CREATE TABLE IF NOT EXISTS todo (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  title VARCHAR(2048) NOT NULL,
  done TINYINT(1) NOT NULL DEFAULT '0',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

### Backend Structure

Create the following file structure:

```
todo-list/
├── api/
│   └── config/
│       └── db.php          ← Database connection configuration
├── index.php               ← Main backend file (handles all actions)
├── src/                    ← React frontend code
└── ...
```

### Backend Files

1. **`api/config/db.php`** - Database connection function
   - Contains MySQL connection settings
   - Provides `getDBConnection()` function

2. **`index.php`** - Main backend file (at project root)
   - Handles all POST actions: `new`, `delete`, `toggle`, `update`
   - Reads all tasks from database into `$taches` variable (sorted by `created_at DESC`)
   - Returns JSON response for React fetch requests

### Backend Actions

The `index.php` file handles the following POST actions:

- **`new`** - Add a new task (requires `title` in POST)
- **`delete`** - Delete a task (requires `id` in POST)
- **`toggle`** - Toggle task completion status (requires `id` in POST)
- **`update`** - Update task title (requires `id` and `title` in POST)

All actions are sent via POST with `FormData` from React using the Fetch API.

### Running the Backend

1. Place the project inside your PHP server root (e.g., `htdocs/todo-list` for XAMPP, or `www/` for WAMP).
2. Update MySQL credentials in `api/config/db.php`:
   ```php
   $host = 'localhost';
   $user = 'root';  // Your MySQL username
   $pass = '';      // Your MySQL password
   $db = 'todolist';
   ```
3. Ensure the backend is reachable at `http://localhost/todo-list/index.php`.
4. Update `API_URL` in `src/App.js` to point to your PHP backend:
   ```javascript
   const API_URL = 'http://localhost/todo-list/index.php';
   ```
5. Update `App.js` to use `useEffect` and `fetch` to communicate with the backend.

### React Integration

The React app uses the Fetch API to communicate with the PHP backend:

- **No form submission** - React handles all requests via `fetch()`
- **FormData** - Used to send POST data to PHP
- **JSON responses** - PHP returns JSON that React parses
- **No page reloads** - All operations happen asynchronously

## Available Scripts

| Command          | Description                          |
| ---------------- | -------------------------------------|
| `npm start`      | Runs the app in development mode.    |
| `npm run build`  | Bundles the app for production.      |
| `npm test`       | Launches the test runner.            |
| `npm run eject`  | Ejects configuration (irreversible). |

## Customization Tips

- Colors and hover styles live in `src/index.css`. The current palette uses purple gradients (`#a78bfa`, `#8b5cf6`, `#7c3aed`) and blush accents (`#ff6b6b`).
- Icons are inline SVGs defined in `src/Components/PackingList.js`, making it easy to adjust size or colors.
- Bootstrap classes control responsive layout; tweak column classes in `PackingList.js` for alternative arrangements.

## 🚀 Live Demo

[Click here to watch the demo](https://todo-list-eh.vercel.app/)

## 📸 Screenshots

<img src="./public/images/todo-list.png" alt="Todo List Screenshot" width="400">

## 🎥 Project demonstration

<a href="https://www.linkedin.com/feed/update/urn:li:activity:7394878745922396160/">
  <img src="./public/images/demo.png" alt="Watch the video" width="400">
</a>

## 👥 Athors

- HERMOUCH ABDELMAJID
- ANASS ET-TAI

---

Made with ❤️ to keep productivity on track.

