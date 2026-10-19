const Admin = require('../model/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../user/model/index').Model
const Order = require('../../orders/model/index')
const { Model: Product } = require('../../products/model/index')


const crypto = require('crypto')
module.exports.createDefaultAdmin = async () => {
    try {
        const { ADMIN_NAME, ADMIN_MOBILE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.log('Admin seed skipped: ADMIN_EMAIL / ADMIN_PASSWORD missing in .env')
            return
        }

        const exists = await Admin.exists({})
        if (exists) return

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

        await Admin.create({
            name: ADMIN_NAME || 'Admin',
            mobile: ADMIN_MOBILE,
            email: ADMIN_EMAIL.toLowerCase(),
            password: hashedPassword,
        })

        console.log('Default admin created:', ADMIN_EMAIL)
    } catch (error) {
        console.error('Admin seed failed:', error.message)
    }
}



module.exports.adminLogin = async ({ identifier, password }) => {

    try {
        const user = await Admin.findOne({
            $or: [
                {
                    email: identifier.toLowerCase()
                },
                {
                    mobile: identifier
                }
            ],

        }).select('+password')

        const isMatch = user && (await bcrypt.compare(password, user.password))

        if (!isMatch) {
            const error = new Error('Invalid credentials')
            error.statusCode = 401
            throw error
        }



        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
            
        },
            process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        return { token, user: { id: user._id, 
            username: user.name, 
            email: user.email
         } }
    } catch (err) {
        console.error(err)
        throw err
    }
}



const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

// Revenue: cancelled orders count aaga koodaadhu
const REVENUE_FILTER = { orderStatus: { $ne: 'cancelled' } }

module.exports.getDashboardStats = async () => {
    try {
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const [totalUsers, totalProducts, totalOrders, revenueAgg, statusAgg, todayAgg] =
            await Promise.all([
                User.countDocuments(),
                Product.countDocuments(),
                Order.countDocuments(),
                Order.aggregate([
                    { $match: REVENUE_FILTER },
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                ]),
                Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
                Order.aggregate([
                    { $match: { ...REVENUE_FILTER, createdAt: { $gte: startOfToday } } },
                    { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
                ]),
            ])

        const ordersByStatus = {
            pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0,
        }
        statusAgg.forEach((s) => (ordersByStatus[s._id] = s.count))

        return {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: revenueAgg.length ? revenueAgg[0].total : 0,
            ordersByStatus,
            todayOrders: todayAgg.length ? todayAgg[0].orders : 0,
            todayRevenue: todayAgg.length ? todayAgg[0].revenue : 0,
        }
    } catch (err) {
        throw err
    }
}

module.exports.getSalesChart = async (days) => {
    try {
        const from = new Date()
        from.setDate(from.getDate() - (days - 1))
        from.setHours(0, 0, 0, 0)

        const data = await Order.aggregate([
            { $match: { ...REVENUE_FILTER, createdAt: { $gte: from } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                },
            },
            { $sort: { _id: 1 } },
        ])

        // Order illaadha naatkalukku 0 fill pannunga (chart-ku)
        const map = {}
        data.forEach((d) => (map[d._id] = d))

        const result = []
        for (let i = 0; i < days; i++) {
            const d = new Date(from)
            d.setDate(from.getDate() + i)
            const key = d.toISOString().slice(0, 10)
            result.push({
                date: key,
                orders: map[key] ? map[key].orders : 0,
                revenue: map[key] ? map[key].revenue : 0,
            })
        }
        return result
    } catch (err) {
        throw err
    }
}

module.exports.getTopProducts = async (limit) => {
    try {
        return await Order.aggregate([
            { $match: REVENUE_FILTER },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.name' },
                    image: { $first: '$items.image' },
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: '$items.subtotal' },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit },
        ])
    } catch (err) {
        throw err
    }
}

module.exports.getLowStockProducts = async (limit) => {
    try {
        return await Product.find({ stock: { $lte: 10 }, status: 'active' })
            .select('name sku stock images')
            .sort({ stock: 1 })
            .limit(limit)
    } catch (err) {
        throw err
    }
}

module.exports.getAllUsers = async ({ search, status, page, limit }) => {
    try {
        const query = {}
        if (status) query.status = status
        if (search) {
            const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            query.$or = [{ username: regex }, { email: regex }, { mobile: regex }]
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(query),
        ])

        return { users, total, page, pages: Math.ceil(total / limit) }
    } catch (err) {
        throw err
    }
}

module.exports.getUserById = async (id) => {
    
    try {
        const user = await User.findById(id).select('-password')
        if (!user) return null

        const stats = await Order.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(id), orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, orders: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' } } },
        ])

        return {
            user,
            totalOrders: stats.length ? stats[0].orders : 0,
            totalSpent: stats.length ? stats[0].totalSpent : 0,
        }
    } catch (err) {
        throw err
    }
}

module.exports.toggleUserStatus = async (id) => {
    try {
        const user = await User.findById(id).select('-password')
        if (!user) return null

        user.status = user.status === 'blocked' ? 'active' : 'blocked'
        await user.save()
        return user
    } catch (err) {
        throw err
    }
}