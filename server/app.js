const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.set('useFindAndModify', false)
const MongoClient = require('mongodb').MongoClient;
dbConnectionString = process.env.URI
const port = process.env.PORT || 4000

if (!dbConnectionString) {
    throw Error("URI environment valiable not set!")
}

mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
    console.log('Connected to database!')
})

const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

app.listen(port, () => {
    console.log('Listening on port ' + port)
})