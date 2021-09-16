import { TasksPlanner } from "../state";
import { Task } from "../../models/task.interface";
import * as announcementActions from "../actions";

const initialState: TasksPlanner = {
  tasks: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case announcementActions.UPDATE_TASKS:
      return Object.assign({}, state, { tasks: action.tasks });
    default:
      return state;
  }
};
