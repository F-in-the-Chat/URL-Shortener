const express = require('express')
const minifyUrl = require("minify-url");
const app = express()
const port = 5000
const urlTable = {}

app.get('/', (req, res) => {
    res.send({ 'Hello': 'World' })
})

app.get('/item/:item_id', (req, res) => {
    res.send({
        'item_id': req.params.item_id,
        'q': req.query.q === undefined ? null : req.query.q
    })
})

app.get('/short', (req, res) => {
    let shortLink = minifyUrl(req.query.url)
    if(!Object.values(urlTable).includes(shortLink.originalURL)){
        urlTable[shortLink.shortURL] = shortLink.originalURL
    }
    else{
        let pairs = Object.entries(urlTable)
        pairs.forEach(element => {
            if(element[1] ===shortLink.originalURL ){
                shortLink.shortURL = element[0]
            }
        });
    }
    res.send(shortLink.shortURL)
})

app.get('/long', (req, res) => {
    if(urlTable[req.query.url]){
        res.send({
            'fullUrl': urlTable[req.query.url],
            'shortUrl': req.query.url
        })
    }
    else{
        res.send("Error: Not a Valid Short URL")
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`)
})