const sqlite3 = require('sqlite3').verbose()
const { v4: uuidv4 } = require('uuid');
const db = new sqlite3.Database('./database.sqlite3')
const PersonDetails = require('./modules/PersonDetails')
const choreDetails = require('./modules/ChoreDetails')
const HomeworkDetails = require('./modules/HomeworkDetails')
const RUN = 0
const GET = 1
const ALL = 2
const  tables = {
    personsTable: `
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    favoriteProgrammingLanguage TEXT,
    activeTaskCount INTEGER)`,
    homeworkTable:`
CREATE TABLE IF NOT EXISTS homework (
    id TEXT PRIMARY KEY,
    ownerId TEXT,
    status TEXT,
    course TEXT,
    dueDate TEXT,
    details TEXT,
    FOREIGN KEY(ownerId) REFERENCES persons(id))`,
    choresTable:`
CREATE TABLE IF NOT EXISTS chores (
    id TEXT PRIMARY KEY,
    ownerId TEXT,
    status TEXT,
    description TEXT,
    size TEXT,
    FOREIGN KEY(ownerId) REFERENCES persons(id))`,
    TasksTable:`
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    type TEXT,
    ownerId TEXT,
    FOREIGN KEY(ownerId) REFERENCES persons(id))`}  //due date format is YYYY-MM-DD HH:MM:SS.SSS

const cmds = {
    insertPersonData: 'INSERT INTO persons (id, name, email, favoriteProgrammingLanguage, activeTaskCount) VALUES (?, ?, ?, ?, ?)',
    insertTaskData: 'INSERT INTO tasks (id, type, ownerId) VALUES (?, ?, ?)',
    insertChoreData: 'INSERT INTO chores (id, ownerId, status, description, size) VALUES (?, ?, ?, ?, ?)',
    insertHomeorkData: 'INSERT INTO homework (id, ownerId, status, course, dueDate, details) VALUES (?, ?, ?, ?, ?, ?)',
    getPersonDetails: 'SELECT * FROM persons WHERE id = ?',
    getTasktype: 'SELECT type FROM tasks WHERE id = ?',
    getChoreDetails: 'SELECT * FROM chores WHERE id = ?',
    getHomeworkDetails: 'SELECT * FROM homework WHERE id = ?',
    removePersondetails: 'DELETE FROM persons WHERE id = ?',
    removeTaskdetails: 'DELETE FROM tasks WHERE id = ?',
    removeChoredetails: 'DELETE FROM chores WHERE id = ?',
    removeHomeorkdetails: 'DELETE FROM homework WHERE id = ?',
    removePersonTasks: 'DELETE FROM tasks where ownerId = ?',
    removePersonHomework: 'DELETE FROM homework where ownerId = ?',
    removePersonChore: 'DELETE FROM chores where ownerId = ?',
    incrementTaskCount: 'UPDATE persons set activeTaskCount = activeTaskCount + 1 WHERE id = ? ',
    decrementTaskCount: 'UPDATE persons set activeTaskCount = activeTaskCount - 1 WHERE id = ? ',
    getAllChoreDetails: 'SELECT * FROM chores WHERE ownerId = ? AND status LIKE ?',
    getAllHomeworkDetails: 'SELECT * FROM homework WHERE ownerId = ? AND status LIKE ?',
    getAllPersonDetails: 'SELECT * FROM persons'
    
}

for (var key in tables){                //database tables initialzation
       db.run(tables[key])
}
db.run("PRAGMA foreign_keys = ON")      //enable valid forigen key enforcement

let getNewId = () => uuidv4()         //id's are 10 byets hex string

function parsePatchCmd(id, data, type){                                               //parses an update command based on data and type
    let cmd, vals, names 
    switch(type){
        case('person'):
            vals = [data.name, data.email, data.favoriteProgrammingLanguage]
            names = ['name = \'', 'email = \'', 'favoriteProgrammingLanguage = \'']
            cmd = 'UPDATE persons SET '
            cmd = cmd + vals.reduce((prev, curr, index) => {return (curr != undefined) ? (prev == undefined) ? names[index] + curr + '\'' :
                                                                prev + ', ' + names[index] + curr + '\''  : prev}, undefined)
            return cmd = cmd + ' WHERE id = \'' + id + '\''
        
        case('HomeWork'):
            vals = [data.status, data.course, data.dueDate, data.details, data.ownerId]
            names = ['status = \'', 'course = \'', 'dueDate = \'',  'details = \'', 'ownerId = \'' ]
            cmd = 'UPDATE homework SET '
            cmd = cmd + vals.reduce((prev, curr, index) => {return (curr != undefined) ? (prev == undefined) ? names[index] + curr + '\'' :
                                                                prev + ', ' + names[index] + curr + '\''  : prev}, undefined)
            return cmd = cmd + ' WHERE id = \'' + id + '\''

        case('Chore'):
            vals = [data.status, data.description, data.size, data.ownerId]
            names = ['status = \'', 'description = \'', 'size = \'', 'ownerId = \'']
            cmd = 'UPDATE chores SET '
            cmd = cmd + vals.reduce((prev, curr, index) => {return (curr != undefined) ? (prev == undefined) ? names[index] + curr + '\'' :
                                                                prev + ', ' + names[index] + curr + '\''  : prev}, undefined)
            return cmd = cmd + ' WHERE id = \'' + id + '\''
    }
}

class LocalDatabase {
    
    myDB(type, cmd, params){                            //sqlite functions wrapper
        return new Promise((resolve, reject) => {
            switch(type){
                case(RUN):
                db.run(cmd, params, (err, res) => err ? reject(err) : resolve(res))
                break;
                
                case(GET):
                db.get(cmd, params,(err, res) => err ? reject(err) : resolve(res))
                break;
                
                case(ALL):
                db.all(cmd, params, (err, res) => err ? reject(err) : resolve(res))
            }
        })    
    }

    incrementTaskCount(personId){
        let promise =this.myDB(RUN, cmds.incrementTaskCount, [personId])
        return promise
    }

    decrementTaskCount(personId){
        let promise =this.myDB(RUN, cmds.decrementTaskCount, [personId])
        return promise
    }

    insertPersonData(pData){
        let id = getNewId()
        let promise =this.myDB(RUN, cmds.insertPersonData, [id, pData.name, pData.email, pData.favoriteProgrammingLanguage, 0])
        return promise.then( _ => id , err => {throw err})
    }

    getPersonDetails(id) {
        let promise = this.myDB(GET, cmds.getPersonDetails, [id])
        return promise.then(dict => { if (dict != undefined){ return new PersonDetails(dict) } else throw 'No such entry'}, err => {throw err}) 
    }
    
    getAllPersonDetails() {
        let promise = this.myDB(ALL, cmds.getAllPersonDetails, [])
        return promise.then( arr => {return arr.map( dict => new PersonDetails(dict))},  err => {throw err})
    }

    updatePersonDetails(id, pData){
        let promise = this.myDB(RUN, parsePatchCmd(id, pData, 'person'), [])
        return promise.then(_ => this.getPersonDetails(id), err => {throw err})
    }

    removePersondetails(id){
        let deleteTasks = this.myDB(RUN, cmds.removePersonTasks, [id])                          //delete from task table
        let deleteChores = deleteTasks.then(this.myDB(RUN, cmds.removePersonChore, [id]))       //delete from chores table
        let deleteHomework = deleteChores.then(this.myDB(RUN, cmds.removePersonHomework, [id])) //delte from HW table
        let deletePerson = deleteHomework.then(this.myDB(RUN, cmds.removePersondetails, [id]))  //we first delete the persons tasks (keep foriegn keys of tasks valid) 
        return deletePerson
    }

    insertTaskData(ownerId, tData){
        let taskId = getNewId()
        let insertPromise
        if (tData.type == "HomeWork") {
            insertPromise = this.myDB(RUN, cmds.insertHomeorkData, [taskId, ownerId, tData.status, tData.course, tData.dueDate, tData.details])
            insertPromise = insertPromise.then( () => this.myDB(RUN, cmds.insertTaskData, [taskId, 'HomeWork', ownerId]), err => {throw err})
        } else {                                                                                                                                        //first insert to chores/ HWE table
            insertPromise = this.myDB(RUN, cmds.insertChoreData, [taskId, ownerId, tData.status, tData.description, tData.size])                        //then enter the task to type binding in tasks table
            insertPromise = insertPromise.then( () => this.myDB(RUN, cmds.insertTaskData, [taskId, 'Chore', ownerId]), err => {throw err})
        }
        let updatePromise = tData.status != "Done" ? 
        insertPromise.then(res => this.incrementTaskCount(ownerId), err => {throw err}) :                                 //increment count after insertion if needed
        insertPromise
        
        return updatePromise.then(_ => taskId, err => {throw err})                  
    }

    getPersonTaskdetails(ownerId, status){
        if (status == undefined){
            status = '%'                //sql wildcard for any status
        }
        let chorsePromise = this.myDB(ALL, cmds.getAllChoreDetails, [ownerId, status])
        chorsePromise = chorsePromise.then(chores => {return chores.map(dict => new choreDetails(dict))})             
        let homeworkPromise = this.myDB(ALL, cmds.getAllHomeworkDetails, [ownerId, status])
        homeworkPromise = homeworkPromise.then(homeworks => {return homeworks.map( dict => new HomeworkDetails(dict))}) 
        let TasksPromise = chorsePromise.then(chores => {return homeworkPromise.then(homeworks => {return chores.concat(homeworks)})},  err => {throw err})
        return TasksPromise
    }

    getTaskDetails(taskId){
        let promise = this.myDB(GET, cmds.getTasktype, [taskId])
        return promise.then((dict => {if (dict != undefined) {return dict.type == 'HomeWork' ? 
                                                        this.myDB(GET, cmds.getHomeworkDetails, [taskId]).then(dict => new HomeworkDetails(dict)):          //chaining 2 queries, one to get task type
                                                            dict.type == 'Chore' ?                                                                          //2nd to get data fromn chore/hw table
                                                        this.myDB(GET, cmds.getChoreDetails, [taskId]).then(dict => new choreDetails(dict)) : 
                                                            'Bad Task type'} else throw 'No such entry' }))
    }

    updateTaskDetails(taskId, tData){
        let typePromise = this.myDB(GET, cmds.getTasktype, [taskId])            //get task type
        let detailsPromise = typePromise.then((dict => {return dict.type == 'HomeWork' ? this.myDB(GET, cmds.getHomeworkDetails, [taskId]):
                                                        dict.type == 'Chore' ? this.myDB(GET, cmds.getChoreDetails, [taskId]) : 'Bad task type1'}) )    //get task details to check status
        detailsPromise.then(currTask => {if (currTask.status == 'Active' && tData.status == 'Done'){ this.decrementTaskCount(currTask.ownerId)}
                                                             else if (tData.status == 'Active' && currTask.status == 'Done') {this.incrementTaskCount(currTask.ownerId)}})      //increment count if neede
        return typePromise.then((dict => {if (dict.type == 'HomeWork') {return this.myDB(RUN, parsePatchCmd(taskId, tData, 'HomeWork'), []).then(()=> this.getTaskDetails(taskId), err => {throw err})}                //update data in table
                                            else if (dict.type == 'Chore') { return this.myDB(RUN, parsePatchCmd(taskId, tData, 'Chore' ), []).then(()=> this.getTaskDetails(taskId), err => {throw err})} else {'Bad task type2'}}))
    }

    deleteTaskDetails(taskId){
        let typePromise = this.myDB(GET, cmds.getTasktype, [taskId])   //get type
        let detailsPromise = typePromise.then((dict => {return dict.type == 'HomeWork' ? this.myDB(GET, cmds.getHomeworkDetails, [taskId]):
                                                        dict.type == 'Chore' ? this.myDB(GET, cmds.getChoreDetails, [taskId]) : 'Bad task type1'}) )                 //checks if recored exist before deletion
        let deletePromise = typePromise.then(dict => {return dict.type == 'HomeWork' ? this.myDB(RUN, cmds.removeHomeorkdetails, [taskId]):             //remove from HW/chores table
                                                            this.myDB(RUN, cmds.removeChoredetails, [taskId])}, err => {throw err} )
        deletePromise = deletePromise.then(res => { return this.myDB(RUN, cmds.removeTaskdetails, [taskId])},  err => {throw err})                      //remove from tasks table
        return detailsPromise.then(currTask => { if (currTask.status == 'Active'){this.decrementTaskCount(currTask.ownerId)}},  err => {throw err})
    }

    updateTaskStatus(taskId, status){
        return this.updateTaskDetails(taskId, {status: status})
    }

    updateTaskOwner(taskId, ownerId){
        let typePromise = this.myDB(GET, cmds.getTasktype, [taskId])        //get type
        let detailsPromise = typePromise.then((dict => {return dict.type == 'HomeWork' ? this.myDB(GET, cmds.getHomeworkDetails, [taskId]):
                                                        dict.type == 'Chore' ? this.myDB(GET, cmds.getChoreDetails, [taskId]) : 'Bad task type1'}) )    //get deatils to check owner
        detailsPromise.then(currTask => {if (currTask.status == 'Active'){this.incrementTaskCount(ownerId)
                                                                          this.decrementTaskCount(currTask.ownerId)}})           //increment/ decrment if needed
        return this.updateTaskDetails(taskId, {ownerId: ownerId})           //final update to recored
    }


}

const myLocalDatabase = new LocalDatabase();

module.exports = myLocalDatabase;            //we export one instance - a singelton

