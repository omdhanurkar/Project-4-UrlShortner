const urlModel = require("../Models/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")


const shortUrl = async function (req, res) {
    try {
        let { longUrl } = req.body;

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "Plz enter some data in body" })

        if (!longUrl)
            return res.status(400).send({ status: false, message: "longUrl is mandatory" })

        if (!validUrl.isUri(longUrl))
            return res.status(400).send({ status: false, message: "longUrl is not Valid" })

        const checkUrl = await urlModel.find({ longUrl }).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})

        if (checkUrl.length == 0) {
            let urlCode = shortId.generate(longUrl).toLowerCase()
            let shortUrl = "localhost:3000/" + urlCode

            let urlDetails = await urlModel.create({ longUrl: longUrl, shortUrl: shortUrl, urlCode: urlCode })
            let filter = { longUrl: urlDetails.longUrl, shortUrl: urlDetails.shortUrl, urlCode: urlDetails.urlCode }
            return res.status(201).send({ status: true, data: filter })

        }
        
        return res.status(200).send({ status: true, data: checkUrl })
            //return res.status(400).send({ status: false, message: "longUrl is already exist" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { shortUrl }