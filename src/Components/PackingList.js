import { useState } from "react";

function PackingList({ items, onDeletItem, onToggleItem, onEditItem, clearList }) {
    // console.log(items)
    const [sortBy, setSortBy] = useState("packed");

    let sortedItems;
    if (sortBy === "input") sortedItems = items;
    if (sortBy === "description")
        sortedItems = items
            .slice()
            .sort((a, b) => a.description.localeCompare(b.description));
    if (sortBy === "packed")
        sortedItems = items
            .slice()
            .sort((a, b) => Number(a.packed) - Number(b.packed));

    return (
        <div className="list">
            <div className="container px-3 px-md-4 px-lg-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <ul className="list-unstyled mb-0">
                            {sortedItems.map((item) => (
                                <Item
                                    item={item}
                                    onDeletItem={onDeletItem}
                                    onToggleItem={onToggleItem}
                                    onEditItem={onEditItem}
                                    key={item.id}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="actions">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="input">Sort by input order</option>
                    <option value="description">Sort by description</option>
                    <option value="packed">Sort by packed status</option>
                </select>
                {items.length === 0 ? null : (
                    <button onClick={clearList}>Clear List</button>
                )}
             </div>
        </div>
    );
}

function Item({ item, onDeletItem, onToggleItem, onEditItem }) {
    const handleEdit = () => {
        const newDescription = window.prompt("Edit task:", item.description);
        if (newDescription !== null && newDescription.trim() !== "") {
            onEditItem(item.id, newDescription.trim());
        }
    };

    return (
        <li className="row g-2 align-items-center mb-3 mb-md-2 task-item">
            <div className="col-12 col-md-auto checkbox-wrapper">
                <div className="d-flex justify-content-center d-md-block">
                    <input
                        type="checkbox"
                        checked={item.packed}
                        value={item.id}
                        onChange={() => onToggleItem(item.id)}
                        className="form-check-input"
                    />
                </div>
            </div>
            <div className="col-12 col-md task-text-wrapper">
                <span 
                    style={item.packed ? { textDecoration: "line-through" } : {}}
                    className="task-text"
                >
                    {item.description}
                </span>
            </div>
            <div className="col-12 col-md-auto buttons-wrapper">
                <div className="d-flex gap-2 justify-content-center d-md-flex justify-content-md-end">
                    <button onClick={handleEdit} className="icon-button" title="Edit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button onClick={() => onDeletItem(item.id)} className="icon-button" title="Delete">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ff6b6b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </li>
    );
}

export default PackingList;