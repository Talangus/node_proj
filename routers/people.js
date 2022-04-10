const express = require('express')
const PersonData = require('../modules/PersonData')
const peopleRouter = express.Router()

peopleRouter.get('/', (req, res) => {
    //db.getPersonDetails() (retrun array of person details)
  } )

peopleRouter.get('/:id', (req, res) => {
    //db.getPersonDetails(id) (throw error if doesn't exist)
  } )

peopleRouter.patch('/:id') {
    //db.updatePersonDetails(id, personDetails) returns Persondetails
}//complete patch 


peopleRouter.delete( "id")// db.removePersondetails(id) throws error if dosent exist

peopleRouter.get('/:id/tasks') // 
  //db.getTaskdetails(id, status (optional)) /returns tasks of person


peopleRouter.post('/:id/tasks'){
  //db.createTaskDetails (id, TaskData) //need to add to task table and update person table
}


peopleRouter.post('/', (req, res) => {
   //db.insert(personData) -if email exist throws error
} )

module.exports = peopleRouter