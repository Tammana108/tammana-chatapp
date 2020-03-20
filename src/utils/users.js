const users=[]
const addUser=({id,username,room})=>
{
   username=username.trim().toLowerCase()
   room=room.trim().toLowerCase()
   if(!username || !room)
   {
       return
       {error:"Must provide username and room" }
   }
   const existingUser=users.find((user)=>
   {
      return user.username===username && user.room===room
   })
   if(existingUser)
   {
       return {error:'Invalid username'}
   }
   const user={id,username,room}
   users.push(user)
   return{user}
}

const removeUser=(id)=>
{
    const index=users.findIndex((user)=>
    {return user.id===id 
    })
 // console.log(index)
    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>
{
    const target=users.find((user)=>user.id===id)
    return target

}
const getUsersInRoom=(room)=>
{
  const target=users.filter((user)=>user.room===room)
  return target
}

module.exports=
{
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}