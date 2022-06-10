const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const peopleRouter = require('./routers/people');
const tasksRouter = require('./routers/tasks');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use('/api/people', peopleRouter);
app.use('/api/tasks', tasksRouter);

app.listen(port, 'localhost', () => {
    console.log('listening for requests on port ' + port);
});