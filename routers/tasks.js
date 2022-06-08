const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const db = require('../db');
const tasksRouter = express.Router();



tasksRouter.get('/:id', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id).then(data => data ? res.send(data) : res.status(400).send('not found'));
});
    // db.getTaskDetails(id) 


tasksRouter.patch('/:id', (req, res) => {
    /* check id exists */
    /* type and its fildes are compatible */
    /* if all fildes are empty - return 200 */
    //returns TaskDetails
    if (req.body.type === 'HomeWork'){
        if (req.body.course === null || req.body.dueDate === null || req.body.details === null)
            res.status(400).send('Invalid task details');
        else {
            db.updateTaskDetails(req.body).then(data => res.send(data));
        }
    }
    else if (req.body.type === 'Chore'){
        if (req.body.size === null || req.body.description === null)
            res.status(400).send('Invalid task details');
        else {
            db.updateTaskDetails(req.body).then(data => res.send(data));
        }
    }
    else {
        res.status(400).send('Invalid task type');
    }
}); 


tasksRouter.delete('/:id', (req, res) => {
    /* check id exists */
    db.deleteTaskDetails(req.body);
});


tasksRouter.get('/:id/status', (req, res) => {
    /* check id exists */
});
    //db.getTaskdetails(id) returns tasksDetails


tasksRouter.put(':id/status', (req, res) => {
    /* check id exists */
    /* check status is valid */
});
    //db.updateTaskStatus(id, status)


tasksRouter.get('/:id/owner', (req, res) => {
    /* check id exists */
});
    //db.getTaskdetails(id)


tasksRouter.put('/:id/owner', (req, res) => {
    /* check task id and owner id exists */
});
    //db.updateTaskOwner(taskid, Ownerid )

module.exports = tasksRouter;
