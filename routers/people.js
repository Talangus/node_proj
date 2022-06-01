const express = require('express');
const PersonData = require('../modules/PersonData');
const PersonDetails = require('../modules/PersonDetails');
const TaskData = require('../modules/TaskData');
const TaskDetails = require('../modules/TaskDetails');
const db = require('../db');
const peopleRouter = express.Router();

peopleRouter.get('/', (req, res) => {
  db.getAllPersonDetails()
  .then(data => res.send(data))
  .catch(err => res.send(err));
});

peopleRouter.post('/', (req, res) => {
  const newPerson = new PersonData(req.body.name, req.body.emails, req.body.favoriteProgrammingLanguage); 
  db.insertPersonData(newPerson)
    .then(res.status(201).send('Person created successfully'))
    .catch(res.send("A person with email '"+req.body.emails+"' already exists.")); //-if email exist throws error;
 });

peopleRouter.get('/:id', (req, res) => {
  console.log(req.params.id);
    db.getPersonDetails(req.params.id)
      .then(data => res.send(data));
      //.catch(res.send("A person with the id does not exists.")) //(throw error if doesn't exist)
});

peopleRouter.patch('/:id', (req, res) => {
    db.updatePersonDetails(req.params.id, req.body)
      .then(res.send('Person updated successfully. Response body contains updated data.')).catch(err => console.log(err));
}); //complete patch 


peopleRouter.delete('/:id', (req, res) => {});// db.removePersondetails(id) throws error if dosent exist

peopleRouter.get('/:id/tasks', (req, res) => {}); // 
  //db.getPersonTaskdetails(id, status (optional)) /returns tasks of person


peopleRouter.post('/:id/tasks', (req, res) => {});
  
  //db.insertTaskData (id, TaskData) //need to add to task table and update person table


module.exports = peopleRouter;