const Client = require('./pgConnection')
const express = require('express');


const router = express.Router()

 const addnewChat = async(req,res,next)=>{
    try {
            const auther =  req.body.auther;
            const time =  req.body.time;
            const message =  req.body.message;
             
         
            Client.query(`insert into chats(room,massege,auther,time)
                           values('1223','${message}','${auther}','${time}')`,(err,result)=>{
                if(err){
                    res.send('Some internal error')
                     
                }
            });
            Client.end;
            // res.json('message send')
    } catch (error) {
        // console.log(error)
        res.json('error fond   ' +error)
    }
}



const getAllChats = async (req,res,next)=>{
    try {
        Client.query(`SELECT * from chats`,(err,result)=>{
            if(!err){
                res.send(result.rows)
            }
        })
    } catch (error) {
        res.send(error)
    }
}


router.post('/add-new-chat',addnewChat)
router.get('/get-all-chats',getAllChats)

module.exports = router