class TaskData {
    constructor(type, status, course, dueDate, details, description, size){
        this.type = type
        this.course = course
        this.details = details
        this.dueDate = dueDate
        this.status = status
        this.description = description
        this.size = size
    }

    static onlySameTypeData(taskData, type){                      //patch task edge case - only the same task type in data
        return (taskData.type == type && taskData.course == undefined &&   taskData.details == undefined
            && taskData.dueDate == undefined && taskData.status == undefined && taskData.description == undefined
            && taskData.size == undefined) 
    }

    static isEmpty(taskData){
        return (taskData.type == undefined && taskData.course == undefined &&   taskData.details == undefined
                && taskData.dueDate == undefined && taskData.status == undefined && taskData.description == undefined
                && taskData.size == undefined)
    }
    
    static validSize(taskData){
        return (taskData.size == 'Large' || taskData.size == 'Medium' || taskData.size == 'Small')
    }
    
    static validType(taskData){
        return (taskData.type == "Chore" || taskData.type == "HomeWork")
    }
    
    static validStatus(taskData){
        return (taskData.status == "Active" || taskData.status == "Done" || taskData == "Active" || taskData == "Done")
    }
    
    static validDate(taskData){
        const regDate = /^(\d{4})-(\d{2})-(\d{2})[T|' '](\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(([-|+](\d{2}):(\d{2})|Z)?)$/;
        return regDate.test(taskData.dueDate)
    }
    
    static validTypefields(taskData, type){         //checks a task from type "type" doesn't have fields from another type
        switch(type){
            case("HomeWork"):
                return (taskData.size == undefined && taskData.description == undefined)
            
            case("Chore"):
                return (taskData.dueDate == undefined && taskData.details == undefined && taskData.course == undefined)
        }
    }

    static fullTypeCheck(taskData, type){     //checks if a task from type "type" has all the requiered fields
        
        if (taskData.status) {
            if (!this.validStatus(taskData)) //if there is a status and it's unvalid
                return false
        }        
        else taskData.status = "Active"      //if there is no status provided, assign it with active
        
        switch(type){
            case("HomeWork"):
                return (taskData.course && taskData.details && taskData.dueDate)
            
            case("Chore"):
                return (taskData.description && taskData.size && this.validSize(taskData))
        }
    }
}     

module.exports = TaskData;