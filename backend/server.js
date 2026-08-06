const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Fake data
const tasks = [
    { id: 1, name: "Go to gym.", description: " ", deadline: "2024-06-30", priority: "High"},
    { id: 2, name: "Do Homework.", description: "", deadline: "2024-07-15", priority: "Medium"},
    { id: 3, name: "Buy groceries.", description: "", deadline: "2024-07-30", priority: "Low" }
];

// GET endpoint
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.delete("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);

    res.json({ message: "Task deleted" });
});

// POST endpoint
app.post("/tasks", (req, res) => {
    const taskId = tasks.length !== 0 ? tasks[tasks.length - 1].id + 1 : 1;

    const newTask = {
        id: taskId,
        name: req.body.name,
        description: req.body.description ?? "",
        deadline: req.body.deadline ?? Date.now(),
        priority: req.body.priority ?? "Low"
    };

    tasks.push(newTask);

    res.json({
        message: "Task added!"
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});