const express = require('express');
const PersonData = require('../modules/PersonData');
const db = require('../db');
const TaskData = require('../modules/TaskData');
const peopleRouter = express.Router();

peopleRouter.get('/', (req, res) => {
  db.getAllPersonDetails()
    .then(data => res.send(data),
          err => res.send(err));
});

peopleRouter.post('/', (req, res) => {
  if (!PersonData.validFields(req.body))   //check all requierd fields are valid
    res.status(400).send('Required data fields are missing');
  else{
    const newPerson = new PersonData(req.body.name, req.body.email, req.body.favoriteProgrammingLanguage); 
    db.insertPersonData(newPerson)
      .then(person_id => {res.header('Location', 'http://localhost:3000/api/people/' + person_id);
                          res.header('x-Created-Id', person_id);
                          res.status(201).send('Person created successfully');  },
            () => res.status(400).send("A person with email '"+req.body.email+"' already exists.")); 
  }
 });

peopleRouter.get('/:id', (req, res) => {
  db.getPersonDetails(req.params.id)
    .then(data => res.send(data),
          () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist.")); 
});

peopleRouter.patch('/:id', (req, res) => {
  db.getPersonDetails(req.params.id)
    .then(data => {
      if (PersonData.isEmpty(req.body)) //if all fields are empty, response with 200
        res.status(200).send(data);
      else {
        db.updatePersonDetails(req.params.id, req.body)
          .then(pData => res.send(pData),
                () => res.status(400).send("A person with email '"+req.body.email+"' already exists.")) }
      },
      () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."));
}); 


peopleRouter.delete('/:id', (req, res) => {
  db.getPersonDetails(req.params.id)
    .then(() => 
      db.removePersondetails(req.params.id)
        .then(() => res.send('Person removed successfully.'),
              () => res.status(400).end()),
          () => res.status(404).send("A person with the id '"+req.params.id+"' does not exist."));
}); 

peopleRouter.get('/:id/tasks/', (req, res) => {
  db.getPersonDetails(req.params.id).then(() => { 
      const status = req.query.status ? req.query.status.toLowerCase() : undefined;
      if(status != "active" && status != "done" && status)          //status is initialized but not to active or done
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
  db.getPersonDetails(req.params.id).then(() => { 
    const type = req.body.type;
    if (type === 'Chore'){
      if (!TaskData.fullTypeCheck(req.body, "Chore"))
        res.status(400).send('Required data fields are missing, data makes no sense, or data contains illegal values.');
      else {
        db.insertTaskData(req.params.id, req.body)
        .then(task_id => {res.header('Location', 'http://localhost:3000/api/tasks/' + task_id);
                          res.header('x-Created-Id', task_id);
                          res.status(201).send('Task created and assigned successfully'); },
              err => res.send(err));
      }
    }
    else if (type === 'HomeWork'){
      if (!TaskData.fullTypeCheck(req.body, "HomeWork"))
        res.status(400).send('Required data fields are missing, data makes no sense, or data contains illegal values.');
      else if (!TaskData.validDate(req.body))
        res.status(400).send("Bad date format (non RFC3339).")
      else {
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