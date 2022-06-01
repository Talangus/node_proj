const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const tasksRouter = express.Router();



tasksRouter.get('/:id', (req, res) => {
    
});
    // db.getTaskDetails(id) 


tasksRouter.patch('/:id', (req, res) => {});
    //db.updateTaskDetails(id, taskData), returns TaskDetails


tasksRouter.delete('/:id', (req, res) => {});
    //db.deleteTaskDetails(id)


tasksRouter.get('/:id/status', (req, res) => {});
    //db.getTaskdetails(id) returns tasksDetails


tasksRouter.put(':id/status', (req, res) => {});
    //db.updateTaskStatus(id, status)


tasksRouter.get('/:id/owner', (req, res) => {});
    //db.getTaskdetails(id)


tasksRouter.put('/:id/owner', (req, res) => {});
    //db.updateTaskOwner(taskid, Ownerid )

module.exports = tasksRouter;
