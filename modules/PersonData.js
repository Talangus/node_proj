class PersonData{
    constructor(name, email, favoriteProgrammingLanguage){
        this.name = name
        this.email = email
        this.favoriteProgrammingLanguage = favoriteProgrammingLanguage
    }

    static validFields(personData){
        return (personData.name && personData.email && personData.favoriteProgrammingLanguage)
    }

    static isEmpty(personData){
        return (personData.email == undefined && personData.favoriteProgrammingLanguage == undefined && personData.name == undefined)
    }
}

module.exports = PersonData;