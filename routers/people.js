const express = require('express')
const PersonData = require('../modules/PersonData')
const PersonDetails = require('../modules/PersonDetails')
const TaskData = require('../modules/TaskData')
const TaskDetails = require('../modules/TaskDetails')
const peopleRouter = express.Router()

peopleRouter.get('/', (req, res) => {
    //db.getPersonDetails() (retrun array of person details)
  } )

peopleRouter.post('/', (req, res) => {
    //db.insert(personData) -if email exist throws error
 } )

peopleRouter.get('/:id', (req, res) => {
    //db.getPersonDetails(id) (throw error if doesn't exist)
  } )

peopleRouter.patch('/:id', (req, res) => {
    //db.updatePersonDetails(id, personDetails) returns Persondetails
})//complete patch 


peopleRouter.delete('/:id', (req, res) => {})// db.removePersondetails(id) throws error if dosent exist

peopleRouter.get('/:id/tasks', (req, res) => {}) // 
  //db.getTaskdetails(id, status (optional)) /returns tasks of person


peopleRouter.post('/:id/tasks', (req, res) => {})
  //db.createTaskDetails (id, TaskData) //need to add to task table and update person table

peopleRouter.get('/test/:id', (req, res) => {
    let pDetails = await db.getPersonDetails(id)
    res.send(JSON.stringify(pDetails)) 
} )


module.exports = peopleRouter