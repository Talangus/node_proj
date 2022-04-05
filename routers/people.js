const express = require('express')
const PersonData = require('../modules/PersonData')
const peopleRouter = express.Router()

peopleRouter.get('/', (req, res) => {
    res.send('we will return an array of PersonDetails ')
  } )

peopleRouter.get('/:id', (req, res) => {
    res.send('we will return ' + req.params.id + 's PersonData')
  } )

peopleRouter.post('/', (req, res) => {
    res.send('we will parse the body and create new person')
    pData = new PersonData("Tal", "talangus@gmail.com", "js")
} )

module.exports = peopleRouter