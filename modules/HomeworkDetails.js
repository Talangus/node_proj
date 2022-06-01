const TaskDetails = require('./TaskDetails')

class HomeworkDetails extends TaskDetails {
    constructor(dict){
        super()
        this.id = dict.id
        this.type = 'HomeWork'
        this.ownerId = dict.ownerId
        this.status = dict.status
        this.course = dict.course
        this.details = dict.details
        this.dueDate = dict.dueDate
    }
}

module.exports = HomeworkDetails;