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
    db.deleteTaskDetails(req.params.id)
        .then(() => res.send('Task removed successfully.'))
        .catch(res.send('A task with the id '+req.params.id+' does not exist.'));
});

tasksRouter.get('/:id/status', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id)
    .then(succ => res.status(200).send(succ.status),
            () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put(':id/status', (req, res) => {
    /* check id exists */
    /* check status is valid */
    if(req.body != 'active' && req.body !='done')
        res.status(400).send("value '"+req.body+"' is not a legal task status.");
    else{
        db.updateTaskStatus(req.body).then(
            () => res.status(204).send("task's status updated successfully."),
            () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
    }
});

tasksRouter.get('/:id/owner', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id).then(
        succ => res.status(200).send(succ.owner),
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put('/:id/owner', (req, res) => {
    /* check task id and owner id exists */
    db.updateTaskOwner(req.body).then(
        () => res.status(204).send("task's owner updated successfully."),
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

module.exports = tasksRouter;
