import express from "express"
import bodyParser from "body-parser"
import methodOverride from "method-override"
import mongoose from 'mongoose'
import cors from "cors"
import enableWs from 'express-ws'

const app = express()
const port = process.env.PORT || 3000
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(methodOverride())
app.use(router)

enableWs(app)

app.ws('/echo', (ws, req) => {
    ws.on('message', msg => {
      console.log('lord comandante Mauro', msg)
        ws.send(msg)
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.listen(port, () => console.log('Server on port: ', port))

// router.get('/', function(req, res) {
//    res.sendFile(__dirname + '/index.html')
// })


