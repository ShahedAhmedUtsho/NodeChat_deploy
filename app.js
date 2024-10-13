// root import 

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path')
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')

const http = require('http');
const app = express();
const socketIo = require('socket.io');
const server = http.createServer(app);




// internal import 

const {
    notFoundMiddleWare, errorHandler
} = require('./middlewares/common/errorhandler')


const loginRouter = require('./router/loginRouter');
const userRouter = require('./router/userRouter');
const inboxRouter = require('./router/inboxRouter');

const SocketController = require('./Connection/SocketController');

// socket io part 

const io = new socketIo.Server(server);

io.on('connection', (socket) => {



    SocketController(socket, io);

})


// create app 



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))

// app.set('view engine', 'ejs')
app.use('/users', userRouter);
app.use('/inbox', inboxRouter)
app.use('/', loginRouter)
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', "ejs")




// mongodb connect 
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.swwr6sg.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(process.env.MONGO_URL || mongoURI)
    .then(res => {
        console.log('mongodb connected successfully')

    })
    .catch(err => {
        console.log(err)
    })

//middleware


// routeing 
// app.get("/", loginRouter)
// app.get("/users", userRouter)
// app.get("/inbox", inboxRouter)


app.use(notFoundMiddleWare);
app.use(errorHandler)
// error handle 

server.listen(port, () => {
    console.log(`server is running`)
})
