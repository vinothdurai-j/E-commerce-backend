const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },

    mobile: {
        type: String,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        required:true,
        default:'user'
    },
     resetOtp: {
        type: String,
        select: false
    },
    resetOtpExpires: {
        type: Date,
        select: false
    },
    resetOtpAttempts: {
        type: Number,
        default: 0,
        select: false
    }

},

 {
    timestamps: true
})

module.exports.Model = mongoose.model('User', schema)