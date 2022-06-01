const util = require('util') //for debug
const sqlite3 = require('sqlite3').verbose()
const crypto =  require('crypto')
const db = new sqlite3.Database('./database.sqlite3')
const PersonData = require('./modules/PersonData')
const PersonDetails = require('./modules/PersonDetails')
const TaskData = require('./modules/TaskData')
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
    type TEXT)`}  //due date format is YYYY-MM-DD HH:MM:SS.SSS

const cmds = {
    insertPersonData: 'INSERT INTO persons (id, name, email, favoriteProgrammingLanguage, activeTaskCount) VALUES (?, ?, ?, ?, ?)',
    insertTaskData: 'INSERT INTO tasks (id, type) VALUES (?, ?)',
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
    incrementTaskCount: 'UPDATE persons set activeTaskCount = activeTaskCount + 1 WHERE id = ? ',
    getAllChoreDetails: 'SELECT * FROM chores WHERE ownerId = ? AND status LIKE ?',
    getAllHomeworkDetails: 'SELECT * FROM homework WHERE ownerId = ? AND status LIKE ?',
    getAllPersonDetails: 'SELECT * FROM persons'
    
}

for (var key in tables){
       db.run(tables[key])
}

let getNewId = () => crypto.randomBytes(10).toString('hex')

function parsePatchCmd(id, data, type){                                               //make sure Data isn't empty, and not only status change
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
            names = ['status = \'', 'description = \'', 'size = \'', , 'ownerId = \'']
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

    insertPersonData(pData){
        let promise =this.myDB(RUN, cmds.insertPersonData, [getNewId(), pData.name, pData.email, pData.favoriteProgrammingLanguage, 0])
        return promise
    }

    getPersonDetails(id) {
        let promise = this.myDB(GET, cmds.getPersonDetails, [id])
        return promise.then(dict => {return dict != undefined ? new PersonDetails(dict) : null}, err => {throw err})  //db returns undifined if the query res is empty
    }
    
    getAllPersonDetails() {
        let promise = this.myDB(ALL, cmds.getAllPersonDetails, [])
        return promise.then( arr => {return arr.map( dict => new PersonDetails(dict))},  err => {throw err})
    }

    updatePersonDetails(id, pData){
        let promise = this.myDB(RUN, parsePatchCmd(id, pData, 'person'), [])
        return promise
    }

    removePersondetails(id){
        let existPromise = this.getPersonDetails(id)                    //checks if recored exist before deletion
        let deletePromise = existPromise.then(res => {return res != null ? this.myDB(RUN, cmds.removePersondetails, [id]) : null }, err => {throw err} )         
        return deletePromise
    }

    insertTaskData(ownerId, tData){
        let taskId = getNewId()
        let insertPromise
        if (tData.type == "HomeWork") {
            insertPromise = this.myDB(RUN, cmds.insertHomeorkData, [taskId, ownerId, tData.status, tData.course, tData.dueDate, tData.details])
            insertPromise = insertPromise.then( () => this.myDB(RUN, cmds.insertTaskData, [taskId, 'HomeWork']), err => {throw err})
        } else {
            insertPromise = this.myDB(RUN, cmds.insertChoreData, [taskId, ownerId, tData.status, tData.description, tData.size])
            insertPromise = insertPromise.then( () => this.myDB(RUN, cmds.insertTaskData, [taskId, 'Chore']), err => {throw err})
        }
        let updatePromise = tData.status != "Done" ? 
        insertPromise.then(() => {this.myDB(RUN, cmds.incrementTaskCount ,[ownerId])}, err => {throw err}) :
        insertPromise
        
        return updatePromise
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
        return promise.then((dict => {return dict == undefined ? null : dict.type == 'HomeWork' ? 
                                                        this.myDB(GET, cmds.getHomeworkDetails, [taskId]).then(dict => new HomeworkDetails(dict)):
                                                    dict.type == 'Chore' ? 
                                                    this.myDB(GET, cmds.getChoreDetails, [taskId]).then(dict => new choreDetails(dict)) : 
                                                    null}))
    }

    updateTaskDetails(taskId, tData){
        let promise = this.myDB(GET, cmds.getTasktype, [taskId])
        return promise.then((dict => {return dict.type == 'HomeWork' ? this.myDB(RUN, parsePatchCmd(taskId, tData, 'HomeWork'), []):
                                             dict.type == 'Chore' ? this.myDB(RUN, parsePatchCmd(taskId, tData, 'Chore' ), []) : null}))
    }

    deleteTaskDetails(taskId){
        let existPromise = this.myDB(GET, cmds.getTasktype, [taskId]).then(res => {return res == undefined ? null : res})                   //checks if recored exist before deletion
        let deletePromise = existPromise.then(dict => {return dict == null ? 0 : 
                                                              dict.type == 'HomeWork' ? this.myDB(RUN, cmds.removeHomeorkdetails, [taskId]):
                                                              this.myDB(RUN, cmds.removeChoredetails, [taskId])}
                                                              , err => {throw err} )
        return deletePromise.then(res => { return res != 0 ? this.myDB(RUN, cmds.removeTaskdetails, [taskId]): null},  err => {throw err})
    }

    updateTaskStatus(taskId, status){
        let promise = this.myDB(GET, cmds.getTasktype, [taskId])
        return promise.then((dict => {return dict.type == 'HomeWork' ? this.myDB(RUN, parsePatchCmd(taskId,{status: status}, 'HomeWork'), []):
                                             dict.type == 'Chore' ? this.myDB(RUN, parsePatchCmd(taskId, {status: status}, 'Chore' ), []) : null}))

    }

    updateTaskOwner(taskId, ownerId){
        let promise = this.myDB(GET, cmds.getTasktype, [taskId])
        return promise.then((dict => {return dict.type == 'HomeWork' ? this.myDB(RUN, parsePatchCmd(taskId,{ownerId: ownerId}, 'HomeWork'), []):
                                             dict.type == 'Chore' ? this.myDB(RUN, parsePatchCmd(taskId, {ownerId: ownerId}, 'Chore' ), []) : null}))
    }


}

//TODO:
//- patch params are optional, need to check active tasks count



function printRes (promise) { promise.then(result => console.log(util.inspect(result,false, null))) }
function insertPersones () {
    pData1 = new PersonData("tal", "talangus@f.com", "python")
    pData2 = new PersonData("tal2", "talangus@f2.com", "python3")
    myLocalDatabase.insertPersonData(pData1)
    myLocalDatabase.insertPersonData(pData2)
}
function insertTasks(ownerid){
    tData1 = new TaskData("Chore", "Active", undefined, undefined, undefined, "hard task", "Large")
    tData2 = new TaskData("HomeWork", "Active", "101", "10.05.10", "my details", undefined, undefined)
    tData3 = new TaskData("Chore", "Done", undefined, undefined, undefined, "hard task", "Large")
    tData4 = new TaskData("HomeWork", "Active", "102", "10.05.10", "my details", undefined, undefined)
    myLocalDatabase.insertTaskData(ownerid, tData1)
    myLocalDatabase.insertTaskData(ownerid, tData2)
    myLocalDatabase.insertTaskData(ownerid, tData3)
    myLocalDatabase.insertTaskData(ownerid, tData4)
}


const myLocalDatabase = new LocalDatabase();
insertPersones();
//printRes(myLocalDatabase.getAllPersonDetails());
//insertTasks('3e846dd4cad0b2abdc48')
//printRes(myLocalDatabase.getPersonTaskdetails('3e846dd4cad0b2abdc48'))
//printRes(myLocalDatabase.getTaskDetails('6cf9f6bca2cc3f6e6ec4'))
// tData1 = new TaskData("HomeWork", "Done", undefined, "10.05.4230", "my details", undefined, undefined)
// tData2 = new TaskData("Chore", "Done", undefined, undefined, undefined, "hard task vey",undefined)
// pData1 = new PersonData(undefined, "talangus@f2.com22222", "python32222")
//myLocalDatabase.updatePersonDetails('383ec869afe6dbeda318', pData1)
//myLocalDatabase.updateTaskDetails('c6349ff2a32cf3c135d9', tData2)
//printRes(myLocalDatabase.getTaskDetails('74d2e957accedd6a27e7'))
//myLocalDatabase.updateTaskStatus('74d2e957accedd6a27e7', 'Done')
//myLocalDatabase.updateTaskOwner('74d2e957accedd6a27e7', '2055')
//console.log(parsePatchCmd('d66812808abd6dca79ea', tData1, 'HomeWork'))
//printRes(myLocalDatabase.deleteTaskDetails2('eab0f1a4d20a3870ff55'))
//printRes(myLocalDatabase.removePersondetails('ed461887e9f633df4d0d'))

module.exports = myLocalDatabase;            //we export one instance - a singelton

