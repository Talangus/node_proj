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
  /* check all fildes exists and not null (extra values?) */
  const newPerson = new PersonData(req.body.name, req.body.emails, req.body.favoriteProgrammingLanguage); 
  db.insertPersonData(newPerson)
    .then(res.status(201).send('Person created successfully'))
    .catch(res.send("A person with email '"+req.body.emails+"' already exists.")); //-if email exist throws error;
 });

peopleRouter.get('/:id', (req, res) => {
    db.getPersonDetails(req.params.id)
      .then(data => res.send(data));
      //.catch(res.send("A person with the id does not exists.")) //(throw error if doesn't exist)
});

peopleRouter.patch('/:id', (req, res) => {
  /* check id exists */
  /* if all fildes are empty - return 200 */
    db.updatePersonDetails(req.params.id, req.body)
      .then(res.send('Person updated successfully. Response body contains updated data.')).catch(err => console.log(err));
}); //complete patch 


peopleRouter.delete('/:id', (req, res) => {
  /* check id exists */
  db.removePersondetails(req.params.id)
    .then()
    .catch();
}); //throws error if dosent exist

peopleRouter.get('/:id/tasks', (req, res) => {
  /* check id exists */
  /* add to url optional status and check if it's Active/Done only */
}); // 
  //db.getPersonTaskdetails(id, status (optional)) /returns tasks of person


peopleRouter.post('/:id/tasks', (req, res) => {});
  /* check id exists */
  /* is status is invalid - error ? ask michael */
  /* check all fildes exists and not null (extra values?) , different tasks - different fildes */
  //db.insertTaskData (id, TaskData) //need to add to task table and update person table


module.exports = peopleRouter;


/* TODO:
errors catch 
emails vs. email - ask michael
 */