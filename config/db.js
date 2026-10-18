const mongoose = require('mongoose')

module.exports.db= async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected")
    }
    catch(err){
        console.log("MongoDB Connection Faild ",err.message)
        process.exit(1)
    }
}

