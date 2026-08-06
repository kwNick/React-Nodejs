export interface Task {
  id: number;
  name: string;
  description: string;
  deadline: string;
  deadlineTime: string;
  priority: "Low" | "Medium" | "High";
  status: "In Progress" | "Completed" | "Expired";
};