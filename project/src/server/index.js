require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// example API call
app.get('/inforRover/:roverName', async(req, res) => {
    try {
        let images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName}/photos?earth_date=${req.query.maxDate}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ images })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/lstImageRover', async(req, res) => {
    try {
        let infor = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ infor })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))