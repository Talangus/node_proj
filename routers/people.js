const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const db = require('../db');
const read = require('body-parser/lib/read');
const peopleRouter = express.Router();

peopleRouter.get('/', (req, res) => {
  db.getAllPersonDetails()
    .then(data => res.send(data),
          err => res.send(err));
});

peopleRouter.post('/', (req, res) => {
  /* check all fildes exists and not null (extra values?) */
  const newPerson = new PersonData(req.body.name, req.body.emails, req.body.favoriteProgrammingLanguage); 
  db.insertPersonData(newPerson)
    .then(data => { res.setHeader('Location','http://localhost:3000/api/people/person_id');
                    res.setHeader('x-Created-Id','person id');
                    res.status(201).send('Person created successfully');  },
          () => res.status(404).send("A person with email '"+req.body.emails+"' already exists.")); //-if email exist throws error;
 });

peopleRouter.get('/:id', (req, res) => {
  db.getPersonDetails(req.params.id)
    .then(data => res.send(data),
          () => res.status(404).send("A person with email '"+req.body.emails+"' already exists.")); //(throw error if doesn't exist)
});

peopleRouter.patch('/:id', (req, res) => {
  /* check id exists */
  /* if all fildes are empty - return 200 */
  db.getPersonDetails(req.params.id)
    .then(() => 
      db.updatePersonDetails(req.params.id, req.body)
        .then(() => res.send('Person updated successfully. Response body contains updated data.'),
              () => res.status(404).end),
          () => res.status(404).send("A person with email '"+req.body.emails+"' already exists."));
}); //complete patch 


peopleRouter.delete('/:id', (req, res) => {
  /* check id exists */
  db.getPersonDetails(req.params.id)
    .then(() => 
      db.removePersondetails(req.params.id)
        .then(() => res.send('Person removed successfully.'),
              () => res.status(404).send('A person with the id '+req.params.id+' does not exist.')),
          err => res.status(400).send(err));
}); //throws error if dosent exist

peopleRouter.get('/:id/tasks/', (req, res) => {
  /* check id exists */
  /* add to url optional status and check if it's Active/Done only */
  /* returns tasks of person */
  db.getPersonDetails(req.params.id).then(() => { 
      const status = req.query.status ? req.query.status.toLowerCase() : undefined;
      if(status != "active" && status != "done" && status != undefined)
        res.status(404).send('Invalid Status.');
      else{
        db.getPersonTaskdetails(req.params.id, status)
          .then(data => res.send(data))
          .catch(err => console.log(err));
      }
    },
    () => res.status(404).send("A person with email '"+req.body.emails+"' already exists."));
  });


peopleRouter.post('/:id/tasks/', (req, res) => {
  /* need to add to task table and update person table */
  /* check id exists */
  /* is status is invalid - error ? ask michael */
  /* check all fildes exists and not null (extra values?) , different tasks - different fildes */

  db.getPersonDetails(req.params.id).then(() => { 
    const type = req.body.type;
    if (type === 'Chore'){
      if (req.body.description == undefined || req.body.size == undefined ||
          (req.body.status != 'Active' && req.body.status != 'Done' && req.body.status != undefined))
        res.status(404).send('Invalid task fields.');
      else {
        db.insertTaskData(req.params.id, req.body)
        .then(() => { res.setHeader('Location','http://localhost:3000/api/tasks/task_id');
                      res.setHeader('x-Created-Id','task id');
                      res.send('Task created and assigned successfully'); },
              err => res.send(err));
      }
    }
    if (type === 'HomeWork'){
      if (req.body.course == undefined || req.body.details == undefined || req.body.dueDate == undefined
          (req.body.status != 'Active' && req.body.status != 'Done' && req.body.status != undefined))
        res.status(404).send('Invalid task fields.');
      else {
        db.insertTaskData(req.params.id, req.body)
        .then(() => { res.setHeader('Location','');
                      res.setHeader('x-Created-Id','');
                      res.send('Task created and assigned successfully'); },
              err => res.send(err));
      }
    }
  },
  () => res.status(404).send("A person with email '"+req.body.emails+"' already exists."));
});

module.exports = peopleRouter;


/* TODO:
errors catch 
emails vs. email - ask michael
 */
