const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: person mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

// const personName = process.argv[3]

// const personNumber = process.argv[4]

const url = `mongodb+srv://tmonroe19:${password}@cluster0.r5b4z.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: 'Tucker',
    number: '41558458415'
})

if ( false ) {
    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
    })
}

Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})