import express from 'express'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import cors from 'cors'
import enableWs from 'express-ws'
import { LoremIpsum } from 'lorem-ipsum'
import fs from 'fs'



const app = express()
const connects = []
const port = process.env.PORT || 3000
const router = express.Router()
const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 10,
            min: 10
        }
    })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
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
                if (socket.name !== data.name) {

                    fs.readFile(`./tests/${data.name}.json`, (err, data) => {

                        err && socket.send(err)
                        const loremIpsum = JSON.parse(data.toString('utf8'))
                        loremIpsum.test.forEach(e => {
                            console.log(e)
                            return socket.send(e)
                            })                        
                   
                    })
            
            }})      
        
        } 
    
    })
})

// app.ws('/close', (ws, req) => {
//     ws.on('close', () => {
//         ws.send('WebSocket was closed')
//     })
// })

app.get('/test/:test', (req, res) => {
    fs.readFile(`./tests/${req.params.test}.json`, (err, data) => {
        err && console.log('error', err)
        console.log('data', JSON.parse(data.toString('utf8')))
    })
})

app.get('/lorem/:test', (req, res) => {
    const test = []
    for(let i=0; i<10; ++i) {
        test.push(lorem.generateSentences(1))
    }
    const jsonContent = JSON.stringify({test}) 
    fs.writeFile(`./tests/${req.params.test}.json`, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.")
            return console.log(err)
        } 
        console.log("JSON file has been saved.")
    })
    res.send('ok')
})

app.listen(port, () => console.log('Server on port: ', port))
