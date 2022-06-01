const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const tasksRouter = express.Router();



tasksRouter.get('/:id', (req, res) => {
    /* check id exists */
});
    // db.getTaskDetails(id) 


tasksRouter.patch('/:id', (req, res) => {
    /* check id exists */
    /* type and its fildes are compatible */
    /* if all fildes are empty - return 200 */
});
    //db.updateTaskDetails(id, taskData), returns TaskDetails


tasksRouter.delete('/:id', (req, res) => {
    /* check id exists */
});
    //db.deleteTaskDetails(id)


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
