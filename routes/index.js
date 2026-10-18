const express = require('express');
const router = express.Router()

router.use('/v1', require('../models/V1/user/router/index'))
router.use('/v1',require('../models/V1/products/router/index'))
router.use('/v1',require('../models/V1/admin/router/index'))

module.exports = router