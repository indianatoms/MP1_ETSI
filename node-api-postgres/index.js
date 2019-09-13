const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
const basicAuth = require('express-basic-auth')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


//FROM HERE I NEED AUTH
    app.use(basicAuth({
            users: { 'admin': 'heslo' }
                }))
                

app.delete('/applications/:appId/dns_rules/:id', db.deleteDNS)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
