class PersonDetails {
    constructor(dict){
        this.id = dict.id
        this.name = dict.name
        this.email = dict.email
        this.favoriteProgrammingLanguage = dict.favoriteProgrammingLanguage
        this.activeTaskCount = dict.activeTaskCount
    }
}

module.exports = PersonDetails;