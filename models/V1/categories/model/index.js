const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, trim: true },
        image: { type: String },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)