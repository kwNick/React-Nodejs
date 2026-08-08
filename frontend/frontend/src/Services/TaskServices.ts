import { type Task } from "../Types";

const API_URL = "http://localhost:3000/tasks";

export const getTasks = async (): Promise<Task[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

  return response.json();
};

export const createTask = async (task: Omit<Task, "id">) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if(!response.ok){
        throw new Error("Failed to create task");
    }

    return response.json();
}

export const deleteTask = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`,{
        method: "DELETE",
    });

    if(!response.ok){
        throw new Error("Failed to delete task");
    }
};

export const updateTask = async (id: number, updates: Partial<Task>) => {
    const response = await fetch(`${API_URL}/${id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(updates),
    });

    if(!response.ok){
        throw new Error("Failed to update task");
    }

    return response.json();
};