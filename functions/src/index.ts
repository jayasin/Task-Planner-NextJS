import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();
const db = admin.firestore();

export const save = functions.https.onRequest(async (req, res) => {

    try {
        res.set('Access-Control-Allow-Origin', '*');
        req.body = JSON.parse(req.body);

        if(req.body.task_name && req.body.from &&  req.body.to) {
            const saveResponse = await  db.collection('tasks').add({
                task_name: req.body.task_name,
                date: new Date(req.body.from), // for filtering
                from: new Date(req.body.from).toISOString(),
                to: new Date(req.body.to).toISOString(), 
                created_at: new Date().toISOString(),
                modified_at: new Date().toISOString()
              })
        
              res.status(200).send({success: true, message: "Task saved Successfully", data: {...saveResponse}})
        } else {
            res.status(404).send({success: false, message: "Unable to save Task", data: {}, error: {message: "Required Fields  are missing"}})
        }
        
    } catch (error) {
        res.status(404).send({success: false, message: "Unable to save Task", data: {}, error})
    } 

});

export const list = functions.https.onRequest(async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    req.body = JSON.parse(req.body);

    await db.collection("tasks")
    .where('date', '>=', new Date(`${req.body.date} 00:00`))
    .where('date', '<=', new Date(`${req.body.date} 23:59`))
    .get().then((snapShot) => {
        let data = snapShot.docs.map((doc) => {
            return {...doc.data(), id: doc.id};
         }); 
         res.status(200).send({success: true, message: "Task list fetched Successfully", data})
    }).catch((error)=> {
        res.status(404).send({success: false, message: "Unable to get task Data", data: {}, error})
    });
    
})


export const deleteTask = functions.https.onRequest(async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    req.body = JSON.parse(req.body);

    await db.collection("tasks").doc(req.body.id).delete().then((result)=> {
        res.status(200).send({success: true, message: "Task deleted successfully", data: result});
    }).catch((error) => {
        res.status(404).send({success: false, message: "Unable to delete the task", data: {}, error});
    });
})


export const modifyTask = functions.https.onRequest(async (req, res ) =>{ 

    res.set('Access-Control-Allow-Origin', '*');
    req.body = JSON.parse(req.body);

    try {

    if(req.body.task_name && req.body.from &&  req.body.to && req.body.id) {

       const updateRes = await db.collection("tasks").doc(req.body.id).update({
                task_name: req.body.task_name,
                date: new Date(req.body.from), // for filtering
                from: new Date(req.body.from).toISOString(),
                to: new Date(req.body.to).toISOString(), 
                modified_at: new Date().toISOString()
        })

        res.status(200).send({success: true, message: "Task updated Successfully", data: {...updateRes}})
    }
    } catch (error) {
        res.status(404).send({success: false, message: "Unable to update the task", data: {}, error});
    }
})
