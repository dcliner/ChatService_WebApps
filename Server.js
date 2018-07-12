var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var mongoose = require("mongoose")


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = "mongodb://Chat_Users:dcliner1998@ds233061.mlab.com:33061/chat_service_node_js"
var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res) =>{
    Message.find({}, (err,messages) =>{
        res.send(messages)
    })
   

})

app.post('/messages', (req, res) =>{
    var message = new Message(req.body)
message.save((err) => {
    if (err)
        sendStatus(500)

    io.emit('message',req.body)
    res.sendStatus(200)

})
   

})
io.on("connection",(socket) => {
console.log("User is connected")
})

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => 
(console.log('mongo db connection', err)));
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'dbUrl connection error:'));


var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})

