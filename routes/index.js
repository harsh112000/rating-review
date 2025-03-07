const express = require('express');

const router = express.Router();
const pingRoutes = require('./ping');
const healthCheckRoutes = require('./health-check');
const sampleRoutes = require('./sample');
const templateRoutes = require('./templates/template');
const questionRoutes = require('./questions/questions');
const customerTemplateRoutes = require('./templates/customer/template');

pingRoutes(router);
healthCheckRoutes(router);
sampleRoutes(router);
templateRoutes(router);
questionRoutes(router);
customerTemplateRoutes(router);
module.exports = router;
