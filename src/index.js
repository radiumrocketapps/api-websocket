import express from 'express'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import enableWs from 'express-ws'
import { LoremIpsum } from 'lorem-ipsum'
import fs from 'fs'



const app = express()
const connects = []
const port = process.env.PORT || 3000
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(router)

enableWs(app)

app.ws('/:id', (ws, req) => {

    ws.on('open', () => {
    })

    ws.name = req.params.id
    connects.push(ws)
    console.log('nueva conexión', ws.name)
    ws.on('message', message => {

        console.log('connects.length', connects.length)
        const data = JSON.parse(message)
        console.log('data:', data)
        if (connects.length > 0) {

            connects.forEach(socket => {

                console.log(socket.name)
                if (socket.name === data.otherUser) {

                    fs.readFile(`./tests/${data.name}.json`, (err, data) => {

                        err && socket.send(err)
                        const loremIpsum = JSON.parse(data.toString('utf8'))
                        loremIpsum.test.forEach(e => {
                            return socket.send(e)
                            })                        
                   
                    })
            
            }})      
        
        } 
    
    })
})

app.get('/test/:test', (req, res) => {
    fs.readFile(`./tests/${req.params.test}.json`, (err, data) => {
        err && console.log('error', err)
        console.log('data', JSON.parse(data.toString('utf8')))
    })
})

app.get('/loremxsentences', async (req, res) => {
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 100,
            min: 100
        }
    })
    for(let cantSentence=1000; cantSentence<=10000; cantSentence+=250) {
        const test = []
        for(let i=0; i<cantSentence; ++i) {
            test.push(lorem.generateSentences(1))
        }
        const jsonContent = await JSON.stringify({test}) 
        fs.writeFile(`../tests/${cantSentence}.json`, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.")
                return console.log(err)
            } 
            console.log("JSON file has been saved.")
        })
        console.log('lorem:', cantSentence)
    }

    res.send('ok')
})

app.get('/loremxwords', async (req, res) => {
    for(let cantWords=1000; cantWords<=10000; cantWords+=250) {
        let lorem = new LoremIpsum({
            sentencesPerParagraph: {
                max: 8,
                min: 4
            },
            wordsPerSentence: {
                max: cantWords,
                min: cantWords
            }
        })
        const test = []
        for(let i=0; i<100; ++i) {
            test.push(lorem.generateSentences(1))
        }
        const jsonContent = await JSON.stringify({test}) 
        fs.writeFile(`../tests/${cantWords}.json`, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.")
                return console.log(err)
            } 
            console.log("JSON file has been saved.")
        })
        console.log('lorem:', cantWords)
    }

    res.send('ok')
})

app.listen(port, () => console.log('Server on port: ', port))
