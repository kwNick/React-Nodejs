import type { Task } from "../Types";

export default function TaskItem({
    task,
    selectedTask,
    setSelectedTask,
    completeTask,
    deleteTask,
  }: {
    task: Task;
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    completeTask: (id: number) => void;
    deleteTask: (id: number) => void;
  }) {

    const handleSelect = () => {
      setSelectedTask(
        selectedTask?.id === task.id ? null : task
      );
    };


    return (
      <div className={`taskItem `}
        key={task.id} onClick={handleSelect}>
          <p className={`taskText 
                ${selectedTask?.id === task.id ? "selectedTask" : ""} 
                ${task.priority + " " + task?.status?.replace(" ", "").toLowerCase()} 
                ${task.completed ? 'completed' : 'incomplete'}`}
            >
            {task.name}
          </p>
          <div className="taskButtons">
            <button 
            className="finishButton" 
            onClick={(e) => {
                e.stopPropagation();
                completeTask(task.id );
            }}
            >
                {task.completed ? 'UnFinish' : 'Finish'}</button>   <button className="deleteButton" 
                onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
                }}>
                Delete
            </button>
        </div>
      </div>
    )
  };