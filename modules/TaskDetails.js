class TaskDetails {
    constructor(id, type, ownerId, course, details, dueDate, status, description, size){
        this.id = id
        this.type = type
        this.ownerId = ownerId
        this.course = course
        this.details = details
        this.dueDate = dueDate
        this.status = status
        this.description = description
        this.size = size
    }

}       //maybe we should create task as abstract class, with chore and HW implementing it

module.exports = TaskDetails;