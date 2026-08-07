import type { Task } from "../Types";

export default function AddTaskForm(
    {addTask, name, description, deadline, deadlineTime, priority, error, setName, setDescription, setDeadline, setDeadlineTime, setPriority}:{
        addTask: () => void;
        name: string;
        description: string;
        deadline: string;
        deadlineTime: string;
        priority: Task['priority'];
        error: string;
        setName: (name: string) => void;
        setDescription: (description: string) => void;
        setDeadline: (deadline: string) => void;
        setDeadlineTime: (deadlineTime: string) => void;
        setPriority: (priority: Task['priority']) => void;
    }){
    return (
        <div className="addTaskForm">
            <h1>Add Task</h1>

            <form className="addTaskInput" onSubmit={(e) => {
                e.preventDefault();
                addTask();
                }}>

                <input
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                />

                <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                />

                <div className="deadlineInput">
                <input
                    type="text"
                    pattern="\d{2}/\d{2}/\d{4}"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="(MM/DD/YYYY)"
                />
                <input
                    type="text"
                    pattern="\d{2}:\d{2}\s*(AM|PM)"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    placeholder="(HH:MM AM/PM)"
                />
                </div>

                {/* <input
                type="text"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Priority (Low, Medium, High)"
                /> */}
                <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                </select>

                {/* <div className="addUserButton"> */}
                <button type="submit" disabled={!name.trim()}>
                    Add Task
                </button>
                {/* </div> */}
            </form>
                {error && <p className="error">{error}</p>}

        </div>
    );
};