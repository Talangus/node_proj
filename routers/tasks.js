

taskrouter.get('/:id') {
    // db.getTaskDetails(id) 
}

taskrouter.patch('/:id') {
    //db.updateTaskDetails(id, taskData), returns TaskDetails
}

taskrouter.delete('/:id'){
    //db.deleteTaskDetails(id)
}

taskrouter.get('/:id/status'){
    //db.getTaskdetails(id) returns tasksDetails
}

taskrouter.put(':id/status'){
    //db.updateTaskStatus(id, status)
}

taskrouter.get('/:id/owner'){
    //db.getTaskdetails(id)
}

taskrouter.put('/:id/owner'){
    //db.updateTaskOwner(taskid, Ownerid )
}