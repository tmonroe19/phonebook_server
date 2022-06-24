const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Name:  ', request.name)
    console.log('Number:  ', request.number)
    console.log('---')
    next()
}


app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send(<h1>Hello World!</h1>)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name
    const number = body.number

    if (name === undefined) {
        return response.status(400).json({ error: 'The name is missing' })
    }

    if (number === undefined) {
        return response.status(400).json({ error: 'The number is missing' })
    }

    if (persons.some(element => element.name == name)) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }

    const person = new Person({
        id: generateID(),
        name: name,
        number: number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(404).send({ error: 'malformed id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})