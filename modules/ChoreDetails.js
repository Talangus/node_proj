const TaskDetails = require('./TaskDetails')

class choreDetails extends TaskDetails {
    constructor(dict){
        super();
        this.id = dict.id
        this.type = 'Chore'
        this.ownerId = dict.ownerId
        this.status = dict.status
        this.description = dict.description
        this.size = dict.size
    }
}

module.exports = choreDetails