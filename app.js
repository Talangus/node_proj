const express = require('express')
const app = express()
const port = 3000
const peopleRouter = require('./routers/people')



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/:id', (req, res) => {
  res.send(req.params.id)
})

app.use('/api/people', peopleRouter)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})