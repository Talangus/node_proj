class PersonDetails {
    constructor(dict){
        this.id = dict.id
        this.name = dict.name
        this.email = dict.email
        this.favoriteProgrammingLanguage = dict.favLang
        this.activeTaskCount = dict.activeTasks
    }

}

module.exports = PersonDetails;