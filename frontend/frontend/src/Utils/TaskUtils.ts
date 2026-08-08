import type {Task } from '../Types/Types';

export const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1
};

export const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
        const dateA = new Date(`${a.deadline} ${a.deadlineTime}`);
        const dateB = new Date(`${b.deadline} ${b.deadlineTime}`);

        if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
        }

        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
};

// Uses React state so it stays in the app
// export const filteredTasks = sortTasks(tasks).filter(task => {
//     if(activeTab === "To-Do") {
//         return (!task.completed);
//     }

//     if(activeTab === "Completed") {
//         return task.completed;
//     }

//     return true;

// });

export const calculateStatus = (deadline: string, deadlineTime: string): Task["status"] => {

    const currentTime = new Date();
    const taskDeadline = new Date(deadline + " " + deadlineTime);

    if (taskDeadline < currentTime) {
      return "Expired";
    }

    return "In Progress";
  };