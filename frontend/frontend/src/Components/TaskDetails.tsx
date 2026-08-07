import type { Task } from "../Types";

export default function TaskDetails({selectedTask}:{selectedTask: Task | null}){
    return (
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
    );
};