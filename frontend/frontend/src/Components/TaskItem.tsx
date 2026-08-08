import type { Task } from "../Types/Types";

export default function TaskItem({
    task,
    selectedTaskID,
    setSelectedTaskID,
    handleFinishTask,
    handleDeleteTask,
  }: {
    task: Task;
    selectedTaskID: number | null;
    setSelectedTaskID: (id: number | null) => void;
    handleFinishTask: (id: number) => void;
    handleDeleteTask: (id: number) => void;
  }) {

    const handleSelect = () => {
      setSelectedTaskID(
        selectedTaskID === task.id ? null : task.id
      );
    };


    return (
      <div className={`taskItem `}
        key={task.id} onClick={handleSelect}>
          <p className={`taskText 
                ${selectedTaskID === task.id ? "selectedTask" : ""} 
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
                handleFinishTask(task.id );
            }}
            >
                {task.completed ? 'UnFinish' : 'Finish'}</button>   <button className="deleteButton" 
                onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
                }}>
                Delete
            </button>
        </div>
      </div>
    )
  };