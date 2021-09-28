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
/*
    Takes a full length url and turns it into a shortened url
*/
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
/*
* Takes a shortened url and returns the original long url in either JSON or HTML table format depending on the html query parameter
*/
app.get('/mapping', (req, res) => {
    const shortUrl = req.query.url
    if(urlTable[req.query.url]){
        let obj = {"Short URL":shortUrl,"Long URL":urlTable[req.query.url]}
        let html = (`<table>
        <tr>
          <th>Long URL</th>
          <th>Short URL</th>
        </tr>
        <tr>
          <td>`+urlTable[req.query.url]+`</td>
          <td>`+shortUrl+`</td>
        </tr>
    </table>`)
        if(req.query.html){
            res.send(html)
        }
        res.send(obj)
    }
    else{
        res.send("Error: Not a Valid Short URL")
    }
})
/*
* Takes a long url and returns the mapping from the long url to a short url
*/
app.get('/long', (req, res) => {
    if(urlTable[req.query.url]){
        res.redirect(urlTable[req.query.url])
    }
    else{
        res.send("Error: Not a Valid Short URL")
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`)
})