import { useCallback, useEffect, useState } from "react";
import './App.css';
import type { Task } from "./Types";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [deadlineTime, setDeadlineTime] = useState<string>("");
  const [priority, setPriority] = useState<Task["priority"]>("Low");
  // const [status, setStatus] = useState<Task["status"]>("In Progress");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1
  };

  const calculateStatus = (deadline: string, deadlineTime: string): Task["status"] => {

    const currentTime = new Date();
    const taskDeadline = new Date(deadline + " " + deadlineTime);

    if (taskDeadline < currentTime) {
      return "Expired";
    }

    return "In Progress";
  };

  const deleteTask = async (id: number | null) => {
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

  const statusTask = useCallback(async (id: number, updateStatus: string) => {
      const thisTask = tasks.find((task) => task.id == id);
      if(updateStatus === thisTask?.status){
        return;
      }
    
    try{
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateStatus }),
      });

      // refresh list
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      setTasks(data);

      if(selectedTask?.id == id){
        setSelectedTask(data.find((task: Task) => task.id == id));
      }

    }catch(error){
      console.error("Error finishing task:", error);
    }
  }, [selectedTask, tasks]);
  
  const completeTask = async (id: number, updateStatus: string) => {
      const thisTask = tasks.find((task) => task.id == id);
      if(updateStatus === "Completed" && thisTask?.completed){
        return;
      }
    
    try{
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: updateStatus == "Completed" ? true : false }),
      });

      // refresh list
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      setTasks(data);

      if(selectedTask?.id == id){
        setSelectedTask(data.find((task: Task) => task.id == id));
      }

    }catch(error){
      console.error("Error finishing task:", error);
    }
  }

  const addTask = async () => {
    const trimmedName = name.trim();
    
    if(tasks.find(t => t.name.toLowerCase() === trimmedName.toLowerCase())){
      // alert("Task already exists!");
      setError("Task already exists!");
      return;
    }
      const status = calculateStatus(deadline, deadlineTime);

      setError(""); // Clear any previous error message
      try{
        await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description, deadline, deadlineTime, priority, status, completed: false }),
        });

        setName("");
        setDescription("");
        setDeadline("");
        setDeadlineTime("");
        setPriority("Low");

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
      data.forEach((task: Task) => {statusTask(task.id, calculateStatus(task.deadline, task.deadlineTime))});
      setTasks(data);
    }catch(error){
      console.error("Error fetching tasks:", error);
    }
  };
  fetchTasks();

  }, [statusTask]);
  
  return (
    <div className="App">
      <div className="taskList">
        <h1>Tasks</h1>
        
        <div className="taskListContent">
          {tasks.sort((a, b) => {
            const dateA = new Date(a.deadline + " " + a.deadlineTime);
            const dateB = new Date(b.deadline + " " + b.deadlineTime);
            // Sort by deadline first
            if(dateA.getTime() !== dateB.getTime()){
              return dateA.getTime() - dateB.getTime();
            }

            return priorityOrder[b.priority] - priorityOrder[a.priority];

          }).map(task => {
            return (
              <div className={`taskItem `}
                key={task.id} onClick={() => selectedTask === task ? setSelectedTask(null) : setSelectedTask(task)
              }>
                <p className={`taskText ${selectedTask?.id === task.id ? "selectedTask" : ""} ${task.priority + " " + task?.status?.replace(" ", "").toLowerCase()} ${task.completed ? 'completed' : 'incomplete'}`}>{task.name}</p>
                <div className="taskButtons">
                  <button className="finishButton" onClick={(e) => {
                  e.stopPropagation();
                  completeTask(task.id, (task.completed ? 'Incomplete' : 'Completed'));
                  }}>{task.completed ? 'UnFinish' : 'Finish'}</button>   <button className="deleteButton" onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}>Delete</button>
                </div>
              </div>
            )}
          )}
          {/* <div>
            {tasks.filter((task: Task) => task.completed == true).map((task) => (
              <div className={`completedTasks`}
                  key={task.id} onClick={() => selectedTask === task ? setSelectedTask(null) : setSelectedTask(task)
                }>
                  <p className={`taskText ${selectedTask?.id === task.id ? "selectedTask" : ""} ${task.priority + " " + task?.status?.replace(" ", "").toLowerCase()} ${task.completed ? 'completed' : 'incomplete'}`}>{task.name}</p>
                  <div className="taskButtons">
                    <button className="finishButton" onClick={(e) => {
                    e.stopPropagation();
                    completeTask(task.id, "Completed");
                    }}>Finish</button>   <button className="deleteButton" onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}>Delete</button>
                  </div>
                </div>
              )
            )}
          </div> */}
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

          <div className="taskDetails">

            <h1>Task Details</h1>

            <div >
              {selectedTask ? (
                <div className="taskDetailsContent">
                  <p><strong>Name:</strong> {selectedTask.name}</p>
                  <p><strong>Description:</strong> {selectedTask.description}</p>
                  <p><strong>Deadline:</strong> {selectedTask.deadline} {selectedTask.deadlineTime}</p>
                  <p><strong>Priority:</strong> {selectedTask.priority}</p>
                  <p><strong>Status:</strong> {selectedTask.status}</p>
                  <p>{selectedTask.completed ? <strong>Completed</strong> : <strong>Incomplete</strong>}</p>
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