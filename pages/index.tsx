import type { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useRouter } from "next/router";
import { Pie } from "react-chartjs-2";
import moment from "moment";

import TaskCard from "../components/TaskCard";
import Header from "../components/Header";
import { API, showNotification } from "../common/constants";
import { Task } from "../models/task.interface";
import Loader from "../components/Loader";
import { connect } from "react-redux";
import { updateTask } from "../redux/actions";
import { bindActionCreators } from "redux";
import { TasksPlanner } from "../redux/state";
interface Props {
  tasks: Task[];
}

/* Fetching Date Format */
const GetCurrentDate = (): string => {
  const month =
    new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : `${new Date().getMonth() + 1}`;
      const date = new Date().getDate() < 10  ?  `0${new Date().getDate()}` : `${new Date().getDate()}`;
  return `${new Date().getFullYear()}-${month}-${date}`;
};

/* Generating Random RGB value for pie chart */
const getRandomRgb = (): string => {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = (num >> 8) & 255;
  var b = num & 255;
  return "rgb(" + r + ", " + g + ", " + b + ")";
};

/* Pie chart chart options */
const pieChartOptions = {
  maintainAspectRatio: true,
  legend: {
    position: "bottom",
  },
};

const Tasks: NextPage<Props> = ({ tasks, ...props }) => {
  const router = useRouter();
  const [task, setTask] = useState<Task[]>(tasks);
  const [chartData, setChartData] = useState<any>({ pieData: {} });
  const [loader, setLoader] = useState<boolean>(false);

  const getTaskList = async (date?: string) => {
    setLoader(true);
    try {
      const payload = date ? { date } : { date: GetCurrentDate() };

      const { data } = await axios.post(
        API.GET_TASK_LIST,
        { ...payload },
        { headers: { "Content-type": "text/plain;charset=UTF-8" } }
      );
      props?.updateTask(data.data);
      // setTask(data.data);
      // prepareChart(data.data);
      setLoader(false);
    } catch (error) {
      showNotification(false, "Unable to get task List");
      setLoader(false);
    }
  };

  const dateSelectionHanlder = async (event: any) => {
    getTaskList(event.target.value);
  };

  /* Dynamic data preparation for chart visualization */
  const prepareChart = async (TaskData: any) => {
    let labels: string[] = [];
    let backgroundColor: string[] = [];
    let borderColor: string[] = [];
    let data: number[] = [];

    TaskData.forEach((task: any) => {
      const randomColor = getRandomRgb();
      const fromDate = moment(
        moment(task.from, moment.ISO_8601).utc().format()
      );
      const toDate = moment(moment(task.to, moment.ISO_8601).utc().format());
      var duration = moment.duration(toDate.diff(fromDate));
      var hours = duration.asHours();

      labels.push(task.task_name);
      backgroundColor.push(randomColor);
      borderColor.push(randomColor);
      data.push(hours);
    });

    setChartData({
      labels: labels,
      datasets: [{ backgroundColor, borderColor, data }],
    });
  };

  useEffect(() => {
    prepareChart(props?.allTasks);
  }, [props.allTasks]);

  useEffect(() => {
    console.log(tasks);
    props?.updateTask(tasks);
  }, [tasks]);

  return (
    <div>
      <Header />
      <div className="page-container">
        <div className="action-btn-container">
          <div className="date-picker">
            <TextField
              id="date"
              label="Date"
              type="date"
              defaultValue={GetCurrentDate()}
              onChange={dateSelectionHanlder}
            />
          </div>
          <div className="button-wrapper">
            <Button
              variant="contained"
              color="primary"
              className="btn-add-task"
              id="add_task"
              onClick={() => router.push("/addTask")}
            >
              Add Task
            </Button>
          </div>
        </div>
        <div className="tasks-container">
          <div className="task-list">
            <p className="task-list-title">Task List</p>
            <div className="task-card-list">
              {props?.allTasks?.map((taskData: Task) => (
                <TaskCard
                  key={taskData.created_at}
                  name={taskData.task_name}
                  from={taskData.from}
                  to={taskData.to}
                  id={taskData.id}
                  reload={() => getTaskList()}
                />
              ))}

              {props?.allTasks.length ? (
                <></>
              ) : (
                <p className="no-task">No Taks were added for the day</p>
              )}
            </div>
          </div>
          <div className="chart-section">
            {props?.allTasks.length ? (
              <p>Hours of Effort - Projection</p>
            ) : (
              <></>
            )}
            <div className="chart-area">
              <Pie
                data={chartData}
                options={pieChartOptions}
                width={400}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
      {loader ? <Loader /> : <></>}
    </div>
  );
};

/* Fetching data before page rendering */
export const getStaticProps: GetStaticProps<Props> = async () => {
  const payload = { date: GetCurrentDate() };

  const { data } = await axios.post(
    API.GET_TASK_LIST,
    { ...payload },
    { headers: { "Content-type": "text/plain;charset=UTF-8" } }
  );
  return {
    props: {
      tasks: data.data,
    },
  };
};

const mapStateToProps = (state: TasksPlanner) => ({
  allTasks: state.tasks,
});

const mapDispatchToProps = (dispatch) => ({
  updateTask: bindActionCreators(updateTask, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
