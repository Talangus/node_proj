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

<<<<<<< HEAD
module.exports = HomeworkDetails;
=======
module.exports = HomeworkDetails
>>>>>>> 95f719489bfd4e93b43c7d05d2875d7a0c9b2103
