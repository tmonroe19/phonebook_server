const { response } = require('express')
const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors())

app.use(express.json())

app.use(express.static('build'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {

    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(`Phonebook has info for ${persons.length} people. ${Date()}`)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    const maxID = persons.length > 0
        ? Math.floor(Math.random() * 10000000000000000000)
        : 0
    return maxID + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name
    const number = body.number

    if (!name) {
        return response.status(400).json({
            error: 'The name is missing'
        })
    }

    if (!number) {
        return response.status(400).json({
            error: 'The number is missing'
        })
    }

    if (persons.some(element => element.name == name) ){
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }

    const person = {
        id: generateID(),
        name: name,
        number: number
    }

    persons = persons.concat(person)

    response.json(person)
})