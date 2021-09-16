import React, { useState } from 'react';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';


import DeleteIcon from '@material-ui/icons/Delete';
import { API, showNotification } from '../../common/constants';
import EditDialog from '../EditDialog';
import Loader from '../Loader';

type CardData = { 
    name: string, 
    from: string, 
    to: string, 
    id: string
    reload: () => void
}

const TaskCard: React.FC<CardData> = ({name, from, to, id, reload}) => {

    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [loader, setLoader] = useState(false);

    const deleteTaskHandler = async () => {
        try {  
            setLoader(true)
            const {data} = await axios.post(API.DELETE_TASK, {id}, {headers:{ 'Content-type': 'text/plain;charset=UTF-8'}});
            if(data.success){
                setOpen(false);
                reload();
                showNotification(true, "Task Deleted Successfully")
            } 
            setLoader(false)
        } catch (error) {
            showNotification(false, "Unable to delete task")
            setOpen(false);
            setLoader(false)
        }

    }


    return (
        <div className="card">
            
            <p className="title">{name}</p>
            <p className="duration">From: {moment(from, moment.ISO_8601).utc().format('DD-MM-YYYY hh:mm A')}</p>
            <p className="duration">To: {moment(to, moment.ISO_8601).utc().format('DD-MM-YYYY hh:mm A')}</p>
            <div className="card-actions">
                <Tooltip title="Edit">
            <EditIcon onClick={()=> setEditMode(true)} className="btn-edit"/>
            </Tooltip>
            <Tooltip title="Delete">
            <DeleteIcon className="btn-delete" onClick={()=> setOpen(true)}/>   
            </Tooltip>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <div className="delete-dialog">
                    <h1>Do you want to delete this task ?</h1>
                    <div className="button-container">
                    <Button color="primary" onClick={()=> setOpen(false)}>Cancel</Button>
                    <Button color="primary" variant="contained" onClick={deleteTaskHandler}>Delete</Button>
                    </div>
                    {loader ? <Loader/> : <></>}
                </div>
            </Dialog>

            <Dialog open={editMode} onClose={() => setEditMode(false)}>
                <EditDialog closeDialog={()=> setEditMode(false)} updateList={() => reload()} name={name} from={moment(from, moment.ISO_8601).utc().format('yyyy-MM-DD HH:mm').replace(" ", "T")} to={moment(to, moment.ISO_8601).utc().format('yyyy-MM-DD HH:mm').replace(" ", "T")} id={id}/>
            </Dialog>
        </div>
    )
}

export default TaskCard
