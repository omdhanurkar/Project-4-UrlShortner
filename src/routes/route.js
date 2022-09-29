const express = require('express');
const { shortUrl } = require('../Controllers/urlController');
const router = express.Router();

router.get("/test-me", function (req,res) {
    return res.send({ message: "my first ever api" })
})
router.post("/url/shorten", shortUrl)




module.exports = router