const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const Client = require('./pgConnection')
const router = require('./database')
const bodyParser = require('body-parser')


const App = express();
App.use(express.json())
Client.connect();
 

App.use(cors());

App.use('/api',router)

const server = App.listen(4000,()=>{
    console.log('SERVER IS RUNNING AT 4000')
});

const io = new Server(server,{
cors:{
    origin:"http://localhost:3000",
    methods:['GET','POST']
},

})
io.on("connection",(socket)=>{
    console.log(`User is Connected: ${socket.id}`);
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with id: ${socket.id} joined room : ${data}`)
    });
    socket.on("send_message",(data)=>{
       
        //  socket.to(data.room).emit("recive_massege",data)
         socket.to(data.room).emit("recive_massege",data)
        //  console.log(data)
    })
    socket.on("Typing",(data)=>{
        socket.to(data.room).emit("reciveTyping",data);
    
    })
    socket.on("disconnect",()=>{
        console.log("user Disconnected",socket.id)
    })
})

 