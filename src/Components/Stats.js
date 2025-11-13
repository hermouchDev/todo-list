function Stats({ items }) {
    const itemsNum = items.length;
    const packedItems = items.filter((item) => item.packed);
    const percentage = Math.round((packedItems.length / itemsNum) * 100)

    if (!itemsNum)
        return (
            <footer className="stats">
                <em>Start adding some tasks to your ToDo list 😊</em>
            </footer>
        );
    return (
        <footer className="stats">
            <em>
                {percentage === 100
                    ? "Awesome! You crushed your ToDo list! 💪"
                    : `
                    You have ${itemsNum} tasks in your ToDo List, And you already pick ${packedItems.length} ( ${percentage} %)
                `}
            </em>
        </footer>
    );
}

export default Stats;
