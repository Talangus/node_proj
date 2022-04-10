const express = require('express')
const app = express()
const port = 3000
const peopleRouter = require('./routers/people')
const tasksRouter = require('./routers/tasks')


app.use('/api/people', peopleRouter)
app.use('/api/tasks', tasksRouter)


app.listen(port)
