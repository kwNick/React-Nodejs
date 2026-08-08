import { useCallback, useEffect, useState } from "react";
import './App.css';
import type { Task } from "./Types";
import TaskItem from "./Components/TaskItem";
import TaskDetails from "./Components/TaskDetails";
import AddTaskForm from "./Components/AddTaskForm";
import { calculateStatus, sortTasks } from "./Utils/TaskUtils";
import { createTask, deleteTask, getTasks, updateTask } from "./Services/TaskServices";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [deadlineTime, setDeadlineTime] = useState<string>("");
  const [priority, setPriority] = useState<Task["priority"]>("Low");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<"To-Do" | "Completed" | "All">("To-Do");
  const [error, setError] = useState("");


  const filteredTasks = sortTasks(tasks).filter(task => {
    if(activeTab === "To-Do") {
      return (!task.completed);
    }

    if(activeTab === "Completed") {
      return task.completed;
    }

    return true;

  });

  const refreshTasks = async () => {
    const data = await getTasks();
    setTasks(data);
    return data;
  };

  const handleDeleteTask = async (id: number) => {
    
    try{
      await deleteTask(id);
      
      await refreshTasks();

      if(id === selectedTask?.id){
        setSelectedTask(null);
      }

    }catch(error){
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusTask = useCallback(async (id: number, updateStatus: Task['status']) => {
      const thisTask = tasks.find((task) => task.id == id);
      if(updateStatus === thisTask?.status || !thisTask){
        return;
      }
    
    try{
      await updateTask(id, {status: updateStatus})

      const data = await refreshTasks();

      if(selectedTask?.id == id){
        setSelectedTask(data.find((task: Task) => task.id == id) ?? null);
      }

    }catch(error){
      console.error("Error finishing task:", error);
    }
  }, [selectedTask, tasks]);
  
  const handleFinishTask = async (id: number) => {
    const thisTask = tasks.find((task) => task.id == id);

    if(!thisTask) return;
    
    try{
      await updateTask(id, {
        completed: !thisTask.completed,
      });
      
      setSelectedTask(null);

      await refreshTasks();

    }catch(error){
      console.error("Error finishing task:", error);
    }
  }

  const handleAddTask = async () => {
    const trimmedName = name.trim();
    
    if(tasks.find(t => t.name.toLowerCase() === trimmedName.toLowerCase())){
      // alert("Task already exists!");
      setError("Task already exists!");
      return;
    }
      const status = calculateStatus(deadline, deadlineTime);
      const newTask = { name, description, deadline, deadlineTime, priority, status, completed: false };

      setError(""); // Clear any previous error message
      try{
        await createTask(newTask);

        setName("");
        setDescription("");
        setDeadline("");
        setDeadlineTime("");
        setPriority("Low");

        // refresh list
        // resets data on restarting server
        // const response = await fetch("http://localhost:3000/tasks");
        // const data = await response.json();
        // setTasks(data);

        await refreshTasks();

        // setTasks([...tasks, { id: tasks.length + 1, name, description }]);
        // setName(""); //resets data on refresh

      }catch(error){
        console.error("Error adding task:", error);
      }
  }

//   useEffect(() => {
//   const interval = setInterval(() => {
//     setTasks(prevTasks =>
//       prevTasks.map(task => ({
//         ...task,
//         status: calculateStatus(
//           task.deadline,
//           task.deadlineTime
//         )
//       }))
//     );
//   }, 1000);

//   return () => clearInterval(interval);
// }, []);
  
  useEffect(() => {
    const remErrors = async () => {
      setError("");
    };
    remErrors();
  }, [name]);
  
  useEffect(() => {

   const fetchTasks = async () => {
    try{
      const data = await refreshTasks();
      data.forEach((task: Task) => {handleStatusTask(task.id, calculateStatus(task.deadline, task.deadlineTime))});
      setTasks(data);
    }catch(error){
      console.error("Error fetching tasks:", error);
    }
  };
  fetchTasks();

  }, [handleStatusTask]);
  
  return (
    <div className="App">
      <div className="taskList">
        <h1>Tasks</h1>

        <div className="taskTabs">
          <button onClick={() => setActiveTab("To-Do")}>
            To-Do
          </button>

          <button onClick={() => setActiveTab("Completed")}>
            Completed
          </button>

          <button onClick={() => setActiveTab("All")}>
            All Tasks
          </button>
        </div>

        <div className="taskListContent">
          <div className="toDoTasks">
            <h2>{activeTab}</h2>
            {filteredTasks.map((task: Task) => {
              return (
                <TaskItem 
                  task={task} 
                  selectedTask={selectedTask} 
                  setSelectedTask={setSelectedTask} 
                  handleFinishTask={handleFinishTask} 
                  handleDeleteTask={handleDeleteTask}
                />
              )}
            )}
          </div>

        </div>
      </div>

        <div className="rightPanel">

            <AddTaskForm handleAddTask={handleAddTask} name={name} description={description} deadline={deadline}  deadlineTime={deadlineTime} priority={priority} error={error} setName={setName} setDescription={setDescription} setDeadline={setDeadline} setDeadlineTime={setDeadlineTime} setPriority={setPriority}/>

          <TaskDetails selectedTask={selectedTask}/>

        </div>
    </div>
  );
}

export default App;