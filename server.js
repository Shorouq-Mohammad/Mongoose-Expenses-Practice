const express = require('express')
const app = express()
const api = require('./server/routes/api')
const path = require('path')
const mongoose = require('mongoose')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'node_modules')))

mongoose.connect('mongodb://localhost/expensesDB', { useNewUrlParser: true })

app.use('/', api)

const port = 3000
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})
