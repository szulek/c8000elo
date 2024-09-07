const express = require('express')
const bodyParser = require('body-parser')
const { init } = require('./db')
const routes = require('./routes')
const cors = require('cors')

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(routes)
app.use(express.static(__dirname + "/html"));
app.get('/', function(request, response){
  response.sendFile('./html/index.html', { root: '.' })
});


app.get('/admin', function(request, response){
  response.sendFile('./html/admin.html', { root: '.' })
});

init().then(() => {
  console.log('starting server on port 3000')
  app.listen(3000)
})
