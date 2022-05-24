const util = require('util') //for debug

const sqlite3 = require('sqlite3').verbose()
const crypto =  require('crypto')
const db = new sqlite3.Database('./database.sqlite3')
const PersonData = require('./modules/PersonData')
const PersonDetails = require('./modules/PersonDetails')
const RUN = 0
const GET = 1
const ALL = 2
const  tables = {
    personsTable: `
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    favLang TEXT,
    activeTasks INTEGER)`,
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
    insertPersonData: 'INSERT INTO persons (id, name, email, favLang, activeTasks) VALUES (?, ?, ?, ?, ?)',
    getPersonDetails: 'SELECT * FROM persons WHERE id = ?',
    getAllPersonDetails: 'SELECT * FROM persons'
}

for (var key in tables){
       db.run(tables[key])
}

class LocalDatabase {
    
    myDB(type, cmd, params){
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
        let promise =this.myDB(RUN, cmds.insertPersonData, [crypto.randomBytes(10).toString('hex'), pData.name, pData.email, pData.favoriteProgrammingLanguage, 0])
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

    

}

myLocalDatabase = new LocalDatabase()
pData1 = new PersonData("tal", "talangus@f.com", "python")
pData2 = new PersonData("tal", "talangus@fi.com", "python")
//myLocalDatabase.insertPersonData(pData1)
//myLocalDatabase.insertPersonData(pData2)
//t = myLocalDatabase.getPersonDetails("da276e2a70e724655dd5")
//t = myLocalDatabase.getPersonDetails("1")
t = myLocalDatabase.getAllPersonDetails()
t.then(result => console.log(util.inspect(result,false, null)))

module.exports = myLocalDatabase             //we export one instance - a singelton

