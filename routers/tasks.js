const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const db = require('../db');
const tasksRouter = express.Router();
const bodyParser = require('body-parser');


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
    if (req.body.type != undefined)
        res.status(400).send('Type change is illegal.')
    else {
        db.getTaskDetails(req.params.id)
            .then(data => {
                if(Object.keys(req.body).length === 0)
                    res.status(200).send(data);
                else if (data.type === 'HomeWork'){
                    if (req.body.size != undefined || req.body.description != undefined ||
                        (req.body.status != undefined && req.body.status != 'Active' && req.body.status != 'Done'))
                        res.status(400).send('Invalid task details');
                    else {
                        if (req.body.ownerId != undefined)
                            db.getPersonDetails(req.body.ownerId).then(_ => 
                                db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                    err => res.status(400).res(err)),
                                                            () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."))
                        else
                            db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                err => res.status(400).res(err))
                    }
                }
                else {
                    if (req.body.dueDate != undefined || req.body.course != undefined || req.body.details != undefined ||
                        (req.body.size != undefined && req.body.size != 'Large' && req.body.size != 'Medium' && req.body.size != 'Small') ||
                        (req.body.status != undefined && req.body.status != 'Active' && req.body.status != 'Done'))
                        res.status(400).send('Invalid task details');
                    else {
                        if (req.body.ownerId != undefined)
                            db.getPersonDetails(req.body.ownerId).then(_ => 
                                db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                    err => res.status(400).res(err)),
                                                            () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."))
                        else
                            db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                err => res.status(400).res(err))
                    }
                }},
            () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
    }
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
        data => res.status(200).json(data.status),
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put('/:id/status', (req, res) => {
    /* check id exists */
    /* check status is valid */
    db.getTaskDetails(req.params.id)
        .then(() => {
            if(req.body != 'Active' && req.body !='Done')
                res.status(400).send("value "+req.body+" is not a legal task status.");
            else{
                db.updateTaskStatus(req.params.id, req.body).then(
                    () => res.status(204).send("task's status updated successfully."),
                    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
            }
        },
    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.get('/:id/owner', (req, res) => {
    /* check id exists */
    db.getTaskDetails(req.params.id).then(
        data => res.status(200).json(data.ownerId),
        () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put('/:id/owner', (req, res) => {
    /* check task id and owner id exists */
    db.getTaskDetails(req.params.id)
        .then(() => {
        db.updateTaskOwner(req.params.id, req.body).then(
            () => res.status(204).send("task's owner updated successfully."),
            () => {res.status(404).send("person with id '"+req.body+"' does not exist.")});
        },
    () => res.status(404).send("A task with the id '"+req.params.id+"' does not exist."));;
});

module.exports = tasksRouter;
