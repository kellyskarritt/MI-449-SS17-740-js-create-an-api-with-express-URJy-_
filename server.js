var express = require('express')
var app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var port = process.env.PORT || 8080

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my TODO list!'
  })
})

var todos = require('./todos.js')

app.get('/todos', function (request, response) {
  response.json(todos)
})

app.get('/todos/:slug', function (request, response) {
  if (!todos[request.params.slug]) {
    response.status(404).end('sorry, no such todo: ' + request.params.slug)
    return
  }
  response.json(todos[request.params.slug])
})

app.post('/todos', function (request, response) {
  var slug = request.body.text.trim().toLowerCase().split(' ').join('-')
  todos[slug] = {
    text: request.body.text.trim(),
    completed: request.body.completed
  }
  response.redirect('/todos/' + slug)
})

app.delete('/todos/:slug', function (request, response) {
  delete todos[request.params.slug]
  response.redirect('/todos')
})

app.put('/todos/:slug', function (request, response) {
  var todo = todos[request.params.slug]
  if (request.body.text !== undefined) {
    todo.text = request.body.text.trim()
  }
  if (request.body.completed !== undefined) {
    todo.completed = request.body.completed
  }
  response.redirect('/todos')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
