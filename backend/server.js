const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Fake data
const tasks = [
    { id: 1, name: "Go to gym.", description: "Gold's Gym", deadline: "08/30/2026", deadlineTime: "11:59 PM", priority: "High", status: "In Progress" },
    { id: 2, name: "Do Homework.", description: "Math/Geography/Reading", deadline: "07/15/2024", deadlineTime: "11:59 PM", priority: "Medium", status: "Expired" },
    { id: 3, name: "Buy groceries.", description: "Milk, Bread, Eggs", deadline: "07/30/2024", deadlineTime: "11:59 PM", priority: "Low", status: "Completed" }
];

// GET endpoint
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.patch("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    // Object.assign(task, req.body);
    Object.defineProperty(task, 'status', { value: req.body.status, writable: true });

    res.json({ message: "Task updated"});
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
    console.log("Received task:", req.body);

    const newTask = {
        id: taskId,
        name: req.body.name,
        description: req.body.description ? req.body.description : req.body.name,
        deadline: req.body.deadline ? req.body.deadline : new Date().toLocaleDateString(),
        deadlineTime: req.body.deadlineTime ? req.body.deadlineTime : "11:59 PM",
        priority: req.body.priority ? req.body.priority : "Low",
        status: req.body.status
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