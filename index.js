const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

// get /
app.get('/', (request, response) => {
  response.redirect('/info')
})

// get /info
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`
  )
})

// get /api/persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// get /api/persons/:id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// delete /api/persons/:id
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

// post /api/persons
app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  if (!person.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }

  if (!person.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  if (persons.find((p) => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: person.name,
    number: person.number,
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

// start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
