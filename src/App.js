import './App.css';
import io from 'socket.io-client';
import {useState} from 'react'
import axios from 'axios';

const socket  = io.connect("http://localhost:4000")


function App() {
  const [userName,setUserName] = useState("");
  const [showRoom,setShowRoom] = useState(false);
  const [typing,setTyping]  = useState("");
  const [message,setMessage]  = useState(null);
  const [oldMessage,setOldmessage] = useState(null);
  const room = 123;



    const join_room = ()=>{
      const userName = prompt('enter name');
      setUserName(userName)
      if(userName){
        socket.emit("join_room",room)
        setShowRoom(true)
      }
    }
    const join_room_2 = ()=>{
      const userName = "Dr.Radha krishna"
      setUserName(userName)
      socket.emit("join_room",room)
      setShowRoom(true)
      
      
    }


    const sendMessage = async ()=>{
                   
      const time = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() 
      if(message){
          const messageData = {
              room:room,
              auther:userName,
              message:message,
              time: time
          }
          await socket.emit("send_message",messageData);
          // setCurrentMassege(messageData)
          const res = await axios.post('http://localhost:4000/api/add-new-chat',{auther:userName,time:time,message:message})
          // console.log(res.data)
          setMessage("")
      }

  }


  const fetchOldMessage = async()=>{
    const res = await axios.get('http://localhost:4000/api/get-all-chats');
      setOldmessage(res.data);
    // oldMessage = res.data
    oldMessage.map(data=>console.log(data.massege))
    // console.log(oldMessage)
}


socket.on("recive_massege",(data)=>{
// setCurrentMassege(data.message)
fetchOldMessage()

})
 

let timerId = null;
const debounce =(func,timer)=>{

if(timerId){
    clearTimeout(timerId)
}
timerId =   setTimeout(()=>{
    func()
},timer)
}
socket.on("reciveTyping",(data)=>{
setTyping(`${data.auther} is typing...`)
debounce(function(){
    setTyping("")
},1000)
})
const SendTypingText = ()=>{
const messageData = {
    room:room,
    auther:userName,
}

socket.emit('Typing',messageData)
}
  
  return (
    <div className="App">
      <div>
        <h1 onClick={join_room_2}>Chat with Client</h1>
        <h1 onClick={join_room}>Chat with Doctor</h1>
       {
        showRoom && <>
        <div >
          <h1 className='title'> Message Box  { typing && <div style={{color:"red",fontSize:'14px'}}>{typing}</div>}</h1>
          <div className='body'>

            {oldMessage&& oldMessage.map(data=><div className={data.auther==userName?"messageSend":"messageReceved"}><div className={data.auther==userName?"sended":"receved"}>{data.massege} </div> </div>)}
          </div>
          <div className='messageContainer'>
            <input type={'text'} placeholder="Type..." onChange={(e)=>setMessage(e.target.value)} onKeyUp={SendTypingText}/>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
        </>
       }
      </div>
    </div>
  );
}

export default App;
