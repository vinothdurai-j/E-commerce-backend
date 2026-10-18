require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const { db } = require('./config/db')
const { createDefaultAdmin } = require('./models/V1/admin/service/index')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hai, this is my first backend project')
})
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 6000


const startServer = async () => {

    try {
        await db();
        await createDefaultAdmin()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Server startup failed:", err.message);
        process.exit(1)
    }
}

startServer();