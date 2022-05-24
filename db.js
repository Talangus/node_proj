const util = require('util') //for debug

const sqlite3 = require('sqlite3').verbose()
const crypto =  require('crypto')
const db = new sqlite3.Database('./database.sqlite3')
const PersonData = require('./modules/PersonData')
const PersonDetails = require('./modules/PersonDetails')
const TaskData = require('./modules/TaskData')
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
    FOREIGN KEY(ownerId) REFERENCES persons(id))`}  //due date format is YYYY-MM-DD HH:MM:SS.SSS

const cmds = {
    insertPersonData: 'INSERT INTO persons (id, name, email, favoriteProgrammingLanguage, activeTaskCount) VALUES (?, ?, ?, ?, ?)',
    insertChoreData: 'INSERT INTO chores (id, ownerId, status, description, size) VALUES (?, ?, ?, ?, ?)',
    insertHomeorkData: 'INSERT INTO homework (id, ownerId, status, course, dueDate, details) VALUES (?, ?, ?, ?, ?, ?)',
    getPersonDetails: 'SELECT * FROM persons WHERE id = ?',
    getAllPersonDetails: 'SELECT * FROM persons',
    updatePersonDetails: 'UPDATE persons SET name = ?, email = ?, favoriteProgrammingLanguage = ?, activeTaskCount = ? WHERE id = ?',
    removePersondetails: 'DELETE FROM persons WHERE id = ?',
    incrementTaskCount: 'UPDATE persons set activeTaskCount = activeTaskCount + 1 WHERE id = ? ',
    getAllChoreDetails: 'SELECT * FROM chores WHERE ownerId = ? AND status LIKE ?',
    getAllHomeworkDetails: 'SELECT * FROM homework WHERE ownerId = ? AND status LIKE ?'
    
}

for (var key in tables){
       db.run(tables[key])
}

let getNewId = () => crypto.randomBytes(10).toString('hex')

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

    updatePersonDetails(id, pDetails){
        let promise = this.myDB(RUN, cmds.updatePersonDetails, [pDetails.name, pDetails.email, pDetails.favoriteProgrammingLanguage, pDetails.activeTaskCount, id])
        return promise
    }

    removePersondetails(id){
        let existPromise = this.getPersonDetails(id)                    //checks if recored exist before deletion
        let deletePromise = existPromise.then(res => {return res != null ? this.myDB(RUN, cmds.removePersondetails, [id]) : null }, err => {throw err} )         
        return deletePromise
    }

    insertTaskData(ownerId, tData){
        let insertPromise = (tData.type == "HomeWork") ? 
        this.myDB(RUN, cmds.insertHomeorkData, [getNewId(), ownerId, tData.status, tData.course, tData.dueDate, tData.details]) :
        this.myDB(RUN, cmds.insertChoreData, [getNewId(), ownerId, tData.status, tData.description, tData.size])
        
        let updatePromise = tData.status != "Done" ? 
        insertPromise.then(res => {this.myDB(RUN, cmds.incrementTaskCount ,[ownerId])}, err => {throw err}) :
        insertPromise
        
        return updatePromise
    }

    getTaskdetails(ownerId, status){
        let chorsePromise = this.myDB(ALL, cmds.getAllChoreDetails, [ownerId, status])
        chorsePromise.then(arr => arr, err => {throw err})                              //create choreDetails
        let homeworkPromise = this.myDB(ALL, cmds.getAllHomeworkDetails, [ownerId, status]) //think on hot to combine them

    }

}

myLocalDatabase = new LocalDatabase()
pData1 = new PersonData("tal", "talangus@f.com", "python")
//myLocalDatabase.insertPersonData(pData1)
tData1 = new TaskData("Chore", "101", "my details", "10.05.10", "Done", "my descript", "Large")
//t = myLocalDatabase.insertTaskData("aaa1a530e356da4b9ba9", tData1)

t = myLocalDatabase.getTaskdetails("aaa1a530e356da4b9ba9", "%")
t.then(result => console.log(util.inspect(result,false, null)))

module.exports = myLocalDatabase             //we export one instance - a singelton

