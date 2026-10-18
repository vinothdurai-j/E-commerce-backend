const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },      
        image: { type: String },                     
        price: { type: Number, required: true },     
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true },
    },
    { _id: false }
)

const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: String,
        mobile: String,
        addressLine1: String,
        addressLine2: String,
        landmark: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },
    { _id: false }
)

const orderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [orderItemSchema], required: true },
        shippingAddress: { type: shippingAddressSchema, required: true },

        itemsTotal: { type: Number, required: true },
        shippingFee: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },

        paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },

        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        cancelledAt: Date,
        deliveredAt: Date,
    },
    { timestamps: true }
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderStatus: 1 })

module.exports = mongoose.model('Order', orderSchema)