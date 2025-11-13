import {useState} from 'react';

function Form({onAddItem}) {
    // const itemsNbr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const [desc, setDesc] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        if (!desc) return;
        const newItem = {
            id : Date.now(), 
            description : desc, 
            packed : false
        };
        // console.log(newItem);

        setDesc("");

        onAddItem(newItem);
    }
    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h3>Let's get things done! 💪 What's your next task ?</h3>
            <div>
                <input 
                    type="text" 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    placeholder="Enter what you want to do ..." />
                <button>Add</button>
            </div>
        </form> 
    );
}


export default Form;