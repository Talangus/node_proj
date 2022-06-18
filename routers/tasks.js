const express = require('express');
const db = require('../db');
const { validStatus } = require('../modules/TaskData');
const TaskData = require('../modules/TaskData');
const tasksRouter = express.Router();

tasksRouter.get('/:id', (req, res) => {
    db.getTaskDetails(req.params.id)
        .then(data => res.send(data),
                () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.patch('/:id', (req, res) => {
  db.getTaskDetails(req.params.id)
      .then(data => {
          if (TaskData.isEmpty(req.body) || TaskData.onlySameTypeData(req.body, data.type) )
              res.status(200).send(data);
          else if (req.body.type && (req.body.type != data.type))             // check we got the same type
              res.status(400).type('text/plain').send('Type change is illegal.')
          
          else if (data.type === 'HomeWork'){
              if (!TaskData.validTypefields(req.body, "HomeWork") || (req.body.status && !TaskData.validStatus(req.body)))
                res.status(400).type('text/plain').send('Invalid Homework data');
              else if (req.body.dueDate && !TaskData.validDate(req.body))
                res.status(400).type('text/plain').send("Bad date format (non RFC3339).");
              else{                                                             //handle request
                if (req.body.ownerId)                                          //if owner id provided                                               
                      db.getPersonDetails(req.body.ownerId).then(_ => 
                          db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                             err => res.status(400).type('text/plain').send(err)),
                                                      () => res.status(404).type('text/plain').send("A person with the id '"+req.params.id+"' does not exist."))
                else
                    db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                        err => res.status(400).type('text/plain').send(err))
              }
          }

          else {                                                                              //chore update
              if (!TaskData.validTypefields(req.body, "Chore") || (req.body.status && !TaskData.validStatus(req.body)) ||
                  (req.body.size && !TaskData.validSize(req.body)))
                    res.status(400).type('text/plain').send('Invalid Chore data');
              else {
                  if (req.body.ownerId)
                      db.getPersonDetails(req.body.ownerId).then(_ => 
                          db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                             err => res.status(400).type('text/plain').send(err)),
                                                      () => res.status(404).type('text/plain').send("A person with the id '"+req.body.ownerId+"' does not exist."))
                  else
                      db.updateTaskDetails(req.params.id, req.body).then(data => res.send(data),
                                                                         err => res.status(400).type('text/plain').send(err))
              }
          }},
      () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));

}); 

tasksRouter.delete('/:id', (req, res) => {
    db.getTaskDetails(req.params.id)
        .then(() => {
            db.deleteTaskDetails(req.params.id).then(
                () => res.send('Task removed successfully.'),
                () => res.send('A task with the id '+req.params.id+' does not exist.'));
        },
    () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.get('/:id/status', (req, res) => {
    db.getTaskDetails(req.params.id).then(
        data => res.status(200).json(data.status),
        () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put('/:id/status', (req, res) => {
    db.getTaskDetails(req.params.id)
        .then(() => {
            if(!validStatus(req.body))
                res.status(400).type('text/plain').send("value '"+req.body+"' is not a legal task status.");
            else{
                db.updateTaskStatus(req.params.id, req.body).then(
                    () => res.status(204).send("task's status updated successfully."),
                    () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));
            }
        },
    () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.get('/:id/owner', (req, res) => {
    db.getTaskDetails(req.params.id).then(
        data => res.status(200).json(data.ownerId),
        () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));
});

tasksRouter.put('/:id/owner', (req, res) => {
    db.getTaskDetails(req.params.id)
        .then(() => {
        db.updateTaskOwner(req.params.id, req.body).then(
            () => res.status(204).send("task's owner updated successfully."),
            () => {res.status(404).type('text/plain').send("person with id '"+req.body+"' does not exist.")});
        },
    () => res.status(404).type('text/plain').send("A task with the id '"+req.params.id+"' does not exist."));;
});

module.exports = tasksRouter;
