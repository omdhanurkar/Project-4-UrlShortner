const express = require('express');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


mongoose.connect("mongodb+srv://group60Database:pdMj2eV7oExXwWKc@group60database.jr8rh6i.mongodb.net/group60Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route); 

app.use((req, res) => {
    return res.status(400).send({ status: false, message: "You enterd wrong Url" })
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});