const urlModel = require("../Models/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")

function isPresent(value) {
    if (typeof (value) === "undefined" || typeof (value) === null) return false
    if (typeof (value) === "string" && value.trim().length == 0) return false
    return true
}


const shortUrl = async function (req, res) {
    try {
        let { longUrl } = req.body;

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Plz enter some data in body" })

        if (!isPresent(longUrl)) return res.status(400).send({ status: false, message: "longUrl is mandatory" })

        if (!validUrl.isUri(longUrl)) return res.status(400).send({ status: false, message: "longUrl is not Valid" })

        const checkUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })

        if (!checkUrl) {
            let urlCode = shortId.generate(longUrl).toLowerCase()
            let shortUrl = "http://localhost:3000/" + urlCode

            let urlDetails = await urlModel.create({ longUrl: longUrl, shortUrl: shortUrl, urlCode: urlCode })
            let filter = { urlCode: urlDetails.urlCode, longUrl: urlDetails.longUrl, shortUrl: urlDetails.shortUrl }
            return res.status(201).send({ status: true, data: filter })

        }

        return res.status(200).send({ status: true, data: checkUrl })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode

        if (!urlCode) return res.status(400).send({ status: false, message: "longUrl is mandatory" })

        const details = await urlModel.findOne({ urlCode })

        if (!details) return res.status(404).send({ status: false, message: "No data found" })

        let longUrl = details.longUrl
        return res.status(302).redirect(longUrl)


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { shortUrl, getUrl };