const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.sqlite3')
const PersonData = require('./modules/PersonData')
const crypto =  require('crypto')
const PersonDetails = require('./modules/PersonDetails')
const  tables = {
    personsTable: `
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
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
    getPersonDetails: 'SELECT * FROM persons WHERE id = ?'
}

for (var key in tables){
       db.run(tables[key])
}

class LocalDatabase {
    
    insertPersonData(pData){
        db.run(cmds.insertPersonData, [crypto.randomBytes(10).toString('hex'), pData.name, pData.email, pData.favoriteProgrammingLanguage, 0])
    }

    async getPersonDetails(id) {
        let promise =  new Promise((resolve, reject) => {
            db.get(cmds.getPersonDetails, [id], function(err, res) {
                if (err) {
                    reject(err)
                } else {    
                    resolve(res) }})
            })
        var pDetails = await promise.then(dict => {return new PersonDetails(dict)}, err => {throw err})
        console.log(pDetails)
        console.log(JSON.stringify(pDetails))
        return pDetails
    } 

    

}

myLocalDatabase = new LocalDatabase()
//pData = new PersonData("tal", "talangus@f.com", "python")
//myLocalDatabase.insertPersonData(pData)

myLocalDatabase.getPersonDetails("450f7a51d1d3b11b3d48")



module.exports = myLocalDatabase             //we export one instance - a singelton

