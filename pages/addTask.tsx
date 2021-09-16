import type { NextPage } from "next";
import React, { useState } from "react";
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { useRouter } from 'next/router'
import axios from 'axios';
import moment from 'moment';


import Header from "../components/Header";
import { API, showNotification } from "../common/constants";
import Loader from "../components/Loader";


const validationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('Task Name is required')
});

const AddTask: NextPage = () => {
    const router = useRouter()
    const [loader, setLoader] = useState(false);
    const [errorText, setErrorText] = useState("");

    const GetCurrentDateAndTime = () => {
        const currentDate = new Date();

        const month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : `${currentDate.getMonth() + 1}`;
        const date = `${currentDate.getFullYear()}-${month}-${currentDate.getDate()}`;
        const hours = (currentDate.getHours() < 10) ? `0${currentDate.getHours()}`: `${currentDate.getHours()}`;
        const minutes = (currentDate.getMinutes() < 10) ? `0${currentDate.getMinutes()}`: `${currentDate.getMinutes()}`;
        return `${date}T${hours}:${minutes}`
      }

    const formik = useFormik({
        initialValues: {
            name: '',
            from: GetCurrentDateAndTime(),
            to: GetCurrentDateAndTime()
        },
        validationSchema: validationSchema,
        onSubmit: async (values: any) => {

            /* Converting datepicker format to Date Format  */
            const formData = {
                task_name: values.name.trim(), 
                from: values.from.replace("T", " "),
                to: values.to.replace("T", " ")
            }

            const fromDate = moment(moment(formData.from, moment.ISO_8601).utc().format());
            const toDate = moment(moment(formData.to, moment.ISO_8601).utc().format());
            var duration = moment.duration(toDate.diff(fromDate));
            var minutes = duration.asMinutes();


            if(minutes <= 0) {
                setErrorText("To time should be greater than From time")
                return
            } else if(formData.from.split(" ")[0] !== formData.to.split(" ")[0]) {
                setErrorText("From and To date should be same")
                return
            }


            try {
                setLoader(true)
                const {data} = await axios.post(API.SAVE_TASK, {...formData}, {headers:{ 'Content-type': 'text/plain;charset=UTF-8'}});
                router.back()
                setLoader(false)
                showNotification(true, "Task added Successfully")
            } catch (error) {
                router.back()
                setLoader(false)
                showNotification(false, "Unable to add task")
            }
        },
    });


    return (
        <div>
            <Header />
            <div className="page-container">
                <div className="add-task-form">
                    <h2 className="add-task-title">Create Task</h2>
                    <form id='add_task_form' onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Task Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            id="from"
                            label="From"
                            type="datetime-local"
                            value={formik.values.from}
                            onChange={formik.handleChange}
                        />

                        <TextField
                            fullWidth
                            id="to"
                            label="To"
                            type="datetime-local"
                            value={formik.values.to}
                            onChange={formik.handleChange}
                        />
                        {errorText.length ? <p className="error-text">* {errorText}</p> : <></>}
                        <div className="form-button-container">
                        <Button color="primary" variant="outlined" fullWidth onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button color="primary" variant="contained" fullWidth type="submit" className="btn-submit-add-task">
                            Submit
                        </Button>
                        </div>
                        
                    </form>
                </div>
            </div>
            {loader ? <Loader/> : <></>}
        </div>
    );
};

export default AddTask;
