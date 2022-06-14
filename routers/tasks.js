const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const db = require('../db');
const tasksRouter = express.Router();

tasksRouter.get('/:id', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id)
        .then(data => res.send(data),
                () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.patch('/:id', (req, res) => {
    /* check id exists */
    /* type and its fildes are compatible */
    /* if all fildes are empty - return 200 */
    //returns TaskDetails
    if(!req.body)
        res.status(200).send("task's status updated successfully.");
    db.getTaskDetails(req.params.id)
        .then(() => {
            if (req.body.type === 'HomeWork'){
                if (req.body.size != undefined || req.body.description != null)
                    res.status(400).send('Invalid task details');
                else
                    db.updateTaskDetails(req.params.id, req.body).then(() => res.send("task's status updated successfully."),
                                                        err => res.status(400).res(err)); 
            }
            else if (req.body.type === 'Chore'){
                if (req.body.dueDate != undefined || req.body.course != undefined || req.body.details != undefined)
                    res.status(400).send('Invalid task details');
                else
                    db.updateTaskDetails(req.body).then(() => res.send("task's status updated successfully."),
                                                        err => res.status(400).res(err));
            }
            else {
                res.status(400).send('Invalid task type');
            }},
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
}); 

tasksRouter.delete('/:id', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id)
        .then(() => {
            db.deleteTaskDetails(req.params.id).then(
                () => res.send('Task removed successfully.'),
                () => res.send('A task with the id '+req.params.id+' does not exist.'));
        },
    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.get('/:id/status', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id).then(
        data => res.status(200).send(data.status),
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put(':id/status', (req, res) => {
    /* check id exists */
    /* check status is valid */
    db.getTaskDetails(req.params.id)
        .then(() => {
            if(req.body != 'active' && req.body !='done')
                res.status(400).send("value '"+req.body+"' is not a legal task status.");
            else{
                db.updateTaskStatus(req.body).then(
                    () => res.status(204).send("task's status updated successfully."),
                    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
            }
        },
    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.get('/:id/owner', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id).then(
        data => res.status(200).send(data.owner),
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put('/:id/owner', (req, res) => {
    /* check task id and owner id exists */
    db.getTaskDetails(req.params.id)
        .then(() => {
        db.updateTaskOwner(req.body).then(
            () => res.status(204).send("task's owner updated successfully."),
            () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
        },
    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));;
});

module.exports = tasksRouter;
