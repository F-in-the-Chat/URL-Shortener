const express = require('express')
const minifyUrl = require("minify-url");
const app = express()
const port = 5000
const urlTable = {}

const URL = require("url").URL;

const stringIsAValidUrl = (s) => {
try {
    new URL(s);
    return true;
} catch (err) {
    return false;
}
};

app.get('/', (req, res) => {
    res.send({ 'Hello': 'World' })
})

app.get('/url-test', (req, res) => {
    res.send(stringIsAValidUrl(req.query.url))
})

app.get('/short', (req, res) => {
    if(!stringIsAValidUrl(req.query.url)){
        res.send("Cannot Shorten Invalid URL")
    }
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
        res.send(urlTable[req.query.url])
    }
    else{
        res.send("Error: Not a Valid Short URL")
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`)
})