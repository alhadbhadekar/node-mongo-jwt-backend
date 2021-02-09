const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const cors = require('cors')

const app = express();

const { MONGODB } = require('./config')
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note')
const auth = require('./middleware/auth')

app.use(cors())
app.use(bodyParser.json())

// app.use('/api/protected', auth, (req, res) => {
//     res.end(`Hi ${req.user.firstName}, you are authenticated!`)
// })

app.use('/api/notes', auth, noteRoutes);

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const err = new Error('not found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    res.status(status).json({ error: { message: err.message }})
})

mongoose.connect(MONGODB, { useNewUrlParser: true})
    .then(() => {
        console.log('connected to mongodb');
        return app.listen(3300)
    })
    .then(() => console.log("Server is running on port 3300"))
    .catch(err => console.log(err.message))