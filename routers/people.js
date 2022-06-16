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
  if (req.body.name == undefined || req.body.email == undefined || req.body.favoriteProgrammingLanguage == undefined)
    res.status(400).send('Required data fields are missing');
  else{
    const newPerson = new PersonData(req.body.name, req.body.email, req.body.favoriteProgrammingLanguage); 
    db.insertPersonData(newPerson)
      .then(person_id => {res.header('Location', 'http://localhost:3000/api/people/' + person_id);
                          res.header('x-Created-Id', person_id);
                          res.status(201).send('Person created successfully');  },
            () => res.status(400).send("A person with email '"+req.body.email+"' already exists.")); //-if email exist throws error;
  }
 });

peopleRouter.get('/:id', (req, res) => {
  db.getPersonDetails(req.params.id)
    .then(data => res.send(data),
          () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist.")); //(throw error if doesn't exist)
});

peopleRouter.patch('/:id', (req, res) => {
  /* check id exists */
  /* if all fildes are empty - return 200 */
  db.getPersonDetails(req.params.id)
    .then(data => {
      if (req.body.name == undefined && req.body.email == undefined && req.body.favoriteProgrammingLanguage == undefined)
        res.status(200).send(data);
      else {
        db.updatePersonDetails(req.params.id, req.body)
          .then(pData => res.send(pData),
                () => res.status(400).send("A person with email '"+req.body.email+"' already exists.")) }
      },
      () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."));
}); //complete patch 


peopleRouter.delete('/:id', (req, res) => {
  /* check id exists */
  db.getPersonDetails(req.params.id)
    .then(() => 
      db.removePersondetails(req.params.id)
        .then(() => res.send('Person removed successfully.'),
              () => res.status(400).end()),
          () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."));
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
    () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."));
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
          (req.body.status != 'Active' && req.body.status != 'Done' && req.body.status != undefined) ||
          (req.body.size != undefined && req.body.size != 'Large' && req.body.size != 'Medium' && req.body.size != 'Small'))
        res.status(400).send('Required data fields are missing, data makes no sense, or data contains illegal values.');
        // ? ask Tal - seprate error messages for any of bad request ? 
      else {
        if (req.body.status == undefined)
          req.body.status = 'Active';
        db.insertTaskData(req.params.id, req.body)
        .then(task_id => {res.header('Location', 'http://localhost:3000/api/tasks/' + task_id);
                          res.header('x-Created-Id', task_id);
                          res.status(201).send('Task created and assigned successfully'); },
              err => res.send(err));
      }
    }
    else if (type === 'HomeWork'){
      const isValidDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(Date.parse(date));
      if (req.body.course == undefined || req.body.details == undefined || req.body.dueDate == undefined ||
          (req.body.status != 'Active' && req.body.status != 'Done' && req.body.status != undefined) || 
          !isValidDate(req.body.dueDate))
        res.status(400).send('Required data fields are missing, data makes no sense, or data contains illegal values.');
      else {
        if (req.body.status == undefined)
          req.body.status = 'Active';
        db.insertTaskData(req.params.id, req.body)
        .then(task_id => {res.header('Location', 'http://localhost:3000/api/tasks/' + task_id);
                          res.header('x-Created-Id', task_id);
                          res.status(201).send('Task created and assigned successfully'); },
              err => res.send(err));
      }
    }
    else {
      res.status(400).send('Required data fields are missing, data makes no sense, or data contains illegal values.');
    }
  },
  () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."));
});

module.exports = peopleRouter;