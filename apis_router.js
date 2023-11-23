const express = require('express');
const router = express.Router();
const apis = require('./apis.js');

router.post("/updateLocation",apis.updateLocation);
router.get("/getLocation",apis.getLocation);
module.exports = router;
