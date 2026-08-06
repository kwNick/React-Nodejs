import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [tasks, setTasks] = useState<{ id: number; name: string; description: string; deadline: string; priority: string }[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<{ id: number; name: string; description: string; deadline: string; priority: string } | null>(null);
  const [error, setError] = useState("");


  const deleteTask = async (id: number) => {
    if(id === selectedTask?.id){
      setSelectedTask(null);
    }

    try{
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });

      // refresh list
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      setTasks(data);

    }catch(error){
      console.error("Error deleting task:", error);
    }
  };
  
  const addTask = async () => {
    const trimmedName = name.trim();
    
    if(tasks.find(t => t.name.toLowerCase() === trimmedName.toLowerCase())){
      // alert("Task already exists!");
      setError("Task already exists!");
      return;
    }

      setError(""); // Clear any previous error message
      try{
        await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description, deadline, priority }),
        });

        setName("");
        setDescription("");
        setDeadline("");
        setPriority("");

        // refresh list
        const response = await fetch("http://localhost:3000/tasks");  //resets data on restarting server
        const data = await response.json();
        setTasks(data);

        // setTasks([...tasks, { id: tasks.length + 1, name, description }]);
        // setName(""); //resets data on refresh

      }catch(error){
        console.error("Error adding task:", error);
      }
  }

  
  useEffect(() => {
    const remErrors = async () => {
      setError("");
    };
    remErrors();
  }, [name]);
  
  useEffect(() => {

   const fetchTasks = async () => {
    try{
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      setTasks(data);
    }catch(error){
      console.error("Error fetching tasks:", error);
    }
  };
  fetchTasks();

  }, []);
  
  return (
    <div className="App">
      <div className="taskList">
        <h1>Tasks</h1>
        
        <div className="taskListContent">
          {tasks.map(task => (
            <div className={`taskItem ${selectedTask?.id === task.id ? "selectedTask" : ""}`}
              key={task.id} onClick={() => selectedTask === task ? setSelectedTask(null) : setSelectedTask(task)
            }>
              <span className="taskText">{task.name}</span>   <button className="deleteButton" onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}>Delete</button>
            </div>
          ))}
        </div>
      </div>

        <div className="rightPanel">

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

              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Enter deadline"
              />

              <input
                type="text"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Enter priority"
              />

              {/* <div className="addUserButton"> */}
                <button type="submit" disabled={!name.trim()}>
                  Add Task
                </button>
              {/* </div> */}
            </form>
              {error && <p className="error">{error}</p>}

          </div>

          <div className="taskDetails">

            <h1>Task Details</h1>

            <div >
              {selectedTask ? (
                <div>
                  <p><strong>Name:</strong> {selectedTask.name}</p>
                  <p><strong>Description:</strong> {selectedTask.description}</p>
                  <p><strong>Deadline:</strong> {selectedTask.deadline}</p>
                  <p><strong>Priority:</strong> {selectedTask.priority}</p>
                </div>
              ):(
                <p>Select a task to see details</p>
              )}
            </div>

          </div>

        </div>
    </div>
  );
}

export default App;