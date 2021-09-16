import React, { useState } from 'react'
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { useRouter } from 'next/router'
import axios from 'axios';
import moment from 'moment';

import { API, showNotification } from '../../common/constants';
import Loader from '../Loader';

const validationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('Task Name is required')
});

type EditDialogProps = {
    closeDialog: () => void;
    updateList: () => void;
    name: string,
    from: string,
    to: string,
    id: string

}

const EditDialog: React.FC<EditDialogProps> = ({closeDialog, name, from, to, id, updateList}) => {
    const router = useRouter()
    const [loader, setLoader] = useState(false);
    const [errorText, setErrorText] = useState("");

    const formik = useFormik({
        initialValues: {name, from, to},
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            /* Converting datepicker format to Date Format  */
            const formData = {
                task_name: values.name.trim(), 
                from: values.from.replace("T", " "),
                to: values.to.replace("T", " "),
                id
            }

            const fromDate = moment(moment(formData.from, moment.ISO_8601).utc().format());
            const toDate = moment(moment(formData.to, moment.ISO_8601).utc().format());
            var duration = moment.duration(toDate.diff(fromDate));
            var minutes = duration.asMinutes();

            if(minutes <= 0) {
                setErrorText("To time should be greater than From time");
                return
            } else if(formData.from.split(" ")[0] !== formData.to.split(" ")[0]) {
                setErrorText("From and To date should be same");
                return
            }

           try {
            setLoader(true)
                const {data} = await axios.post(API.UPDATE_TASK, {...formData}, {headers:{ 'Content-type': 'text/plain;charset=UTF-8'}});
                closeDialog();
                updateList();
                setLoader(false)
                showNotification(true, "Task updated Successfully")
            } catch (error) {
                closeDialog();
                showNotification(false, "Unable to update task")
                setLoader(false)
            }
        },
    });

    return (
        <div>
            <div className="add-task-form">
            <h2 className="add-task-title">Update Task</h2>
                    <form onSubmit={formik.handleSubmit}>
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
                        <Button color="primary" variant="outlined" fullWidth onClick={() => closeDialog()}>
                            Cancel
                        </Button>
                        <Button color="primary" variant="contained" fullWidth type="submit" className="btn-submit-add-task">
                            Submit
                        </Button>
                        </div>
                        
                    </form>
                </div>
                {loader ? <Loader/> : <></>}
        </div>
    )
}

export default EditDialog
