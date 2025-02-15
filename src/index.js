const path=require('path')
const express=require('express')
const app=express()
const Filter=require('bad-words')
const socketio=require('socket.io')
const http=require('http')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const server= http.createServer(app)
const io=socketio(server)
const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
// let count=0
io.on('connection',(socket)=>
{
  console.log('Web socket connection')
  socket.on('join',(options,callback)=>
  {
    const {error,user}=addUser({id:socket.id,...options})
    if(error)
    {
     return callback(error)
    }
    socket.join(user.room)
   
    socket.emit('message',generateMessage('Admin','Welcome!'))
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
    io.to(user.room).emit('roomData',{
      room:user.room,
      users:getUsersInRoom(user.room)
    })
    callback()
  })
 
  socket.on('send Message',(message,callback)=>{
    const user=getUser(socket.id)
      
      const filter=new Filter()
      if(filter.isProfane(message))
      {
        return callback('Profanity is not allowed!')
      }
      
       io.to(user.room).emit('message',generateMessage(user.username,message))
       callback()
    
  })
  socket.on('disconnect',()=>
  {
    const user=removeUser(socket.id)
    if(user){
    io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))
    io.to(user.room).emit('roomData',{
      room:user.room,
      users:getUsersInRoom(user.room)
    })  
  }
  })

  socket.on('getLocation',(coords,callback)=>
  {
    const user=getUser(socket.id)
    
    io.to(user.room).emit('locationmessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
    
  })
//   socket.emit('countUpdated',count)
//   socket.on('increment',()=>
//   {
//       count++
//       io.emit('countUpdated',count)
//   })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})