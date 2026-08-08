export default function TaskTabs({setActiveTab}: {setActiveTab: (tab: "To-Do" | "Completed" | "All") => void}){
    return (
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
    );
}