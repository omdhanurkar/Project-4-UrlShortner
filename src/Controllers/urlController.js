const urlModel = require("../Models/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")
const redis = require("redis");
const {promisify} = require("util");

//Connect to redis
const redisClient = redis.createClient(
    12063,
    "redis-12063.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("OFhshBtOzN0Dg66ExMOGBfe0VChAB9n8", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

function isPresent(value) {
    if (typeof (value) === "undefined" || typeof (value) === null) return false
    if (typeof (value) === "string" && value.trim().length == 0) return false
    return true
}

const createShortUrl = async function (req, res) {
    try {
        let { longUrl } = req.body;

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Plz enter some data in body" })

        if (!isPresent(longUrl)) return res.status(400).send({ status: false, message: "longUrl is mandatory" })

        if (!validUrl.isWebUri(longUrl)) return res.status(400).send({ status: false, message: "longUrl is not Valid" })

        const checkUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })

        if (!checkUrl) {
            let urlCode = shortId.generate(longUrl).toLowerCase()
            let shortUrl = "http://localhost:3000/" + urlCode

            let urlDetails = await urlModel.create({ longUrl: longUrl, shortUrl: shortUrl, urlCode: urlCode })
            await SET_ASYNC(`${urlCode}`,3600, JSON.stringify(urlDetails))
            let filter = { urlCode: urlDetails.urlCode, longUrl: urlDetails.longUrl, shortUrl: urlDetails.shortUrl }
            return res.status(201).send({ status: true, data: filter })
        }

        return res.status(200).send({ status: true, data: checkUrl })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getShortUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode

        if (!urlCode) return res.status(400).send({ status: false, message: "urlCode is mandatory" })

        let cachedData = await GET_ASYNC(`${urlCode}`)
        if (cachedData) {
            let Data = JSON.parse(cachedData)
            return res.status(302).redirect(Data.longUrl)
        }
        else {
            let urlDetails = await urlModel.findOne({ urlCode });
            if (!urlDetails) return res.status(404).send({ status: false, message: "No data found" })
            await SET_ASYNC(`${urlCode}`,3600, JSON.stringify(urlDetails))
            return res.status(302).redirect(urlDetails.longUrl)
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { createShortUrl, getShortUrl };
