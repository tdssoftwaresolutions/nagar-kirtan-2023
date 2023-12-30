const express = require('express');
const router = express.Router();
const apis = require('./apis.js');

router.post("/updateLocation",apis.updateLocation);
router.get("/getLocation",apis.getLocation);
router.post("/donation",apis.newDonation);
router.post("/subscribeNewsletter",apis.subscribeNewsletter);
router.post("/contact",apis.contact);
module.exports = router;
