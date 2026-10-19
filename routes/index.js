const express = require('express');
const router = express.Router()

router.use('/v1', require('../models/V1/user/router/index'))
router.use('/v1',require('../models/V1/products/router/index'))
router.use('/v1',require('../models/V1/admin/router/index'))
router.use('/v1',require('../models/V1/categories/router/index'))
router.use('/v1',require('../models/V1/address/router/index'))
router.use('/v1',require('../models/V1/cart/router/index'))
router.use('/v1',require('../models/V1/orders/router/index'))
router.use('/v1',require('../models/V1/reviews/router/index'))



module.exports = router