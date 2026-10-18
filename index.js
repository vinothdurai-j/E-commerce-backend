const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
app.use(express.json()) 

const {db} = require('./config/db')
const cors =require('cors')



app.get('/', (req, res) => {
    res.send('Hai, this is my first backend project')
})
app.use('/', require('./routes/index')) 

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => {
//         app.listen(process.env.PORT,()=>{
//             console.log('Database connected successfully')
//         })
        
//     })
//     .catch((error) => {
//         console.log('Database failed to connect')
//         console.log(error)
//     })

const PORT  =process.env.PORT || 6000


const startServer = async ()=>{

    try{
        await db();

        app.listen(PORT ,()=>{
          console.log(`Server is running on port ${PORT}`)  
        })
    }catch(err){
        console.error("Server startup failed:", err.message);
    }
}

startServer ();