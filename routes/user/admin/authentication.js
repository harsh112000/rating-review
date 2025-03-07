
const express = require('express');
// const { verifyToken } = require('../../../controllers/user/admin/authentication');

const router = express.Router();
const { signUp, login } = require('../../../controllers/user/admin/authentication');

router.post('/registration', signUp);
router.post('/login', login);

module.exports = router;
