import { Task } from "../../models/task.interface";

export const UPDATE_TASKS = "UPDATE_TASKS";

export const updateTask = (taskArr: Task[]) => (dispatch) => {
  return dispatch({ type: UPDATE_TASKS, tasks: taskArr });
};
