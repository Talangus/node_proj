class TaskDetails {
        
    id
    type
    ownerId
    status

    constructor (){
        if (this.constructor == TaskDetails) {
            throw new Error("Abstract classes can't be instantiated.");
          }
    }

}      

module.exports = TaskDetails;