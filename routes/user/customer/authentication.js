const express = require('express');

const router = express.Router();
const { signUp, login } = require('../../../controllers/user/customer/authentication');

router.post('/registration', signUp);
router.post('/login', login);

module.exports = router;
