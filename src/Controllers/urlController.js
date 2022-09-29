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

        if (!validUrl(longUrl))
            return res.status(400).send({ status: false, message: "longUrl is not Valid" })

        const checkUrl = await urlModel.find(longUrl)
        if (checkUrl)
            return res.status(400).send({ status: false, message: "longUrl is already exist" })

        if(!checkUrl){
            let shortUrl = shortId.generate(longUrl).toLowerCase()
            console.log(shortUrl)
            return res.send(shortUrl)
            
        }

    } catch (err) {

    }
}

module.exports={shortUrl}