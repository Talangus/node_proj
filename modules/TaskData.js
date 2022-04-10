class TaskData {
    constructor(type, course, details, dueDate, status, description, size){
        this.type = type
        this.course = course
        this.details = details
        this.dueDate = dueDate
        this.status = status
        this.description = description
        this.size = size
    }

}       //maybe we should create task as abstract class, with chore and HW implementing it 
        // for example chore shouldn't have course field 

module.exports = TaskData;