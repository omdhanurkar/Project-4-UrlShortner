const express = require('express');
const { createShortUrl, getShortUrl } = require('../Controllers/urlController');
const router = express.Router();

router.post("/url/shorten", createShortUrl)
router.get("/:urlCode", getShortUrl)

module.exports = router