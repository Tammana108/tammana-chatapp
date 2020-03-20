const socket=io()
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $locationSendButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')
const {username,room}=Qs.parse(location.search,{ ignoreQueryPrefix:true})
// socket.on('countUpdated',(count)=>
// {
//     console.log('The count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>
// {
//    console.log('CLicked!')
//    socket.emit('increment')
// })
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationmessagetemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#side-bar-template').innerHTML
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
   const message=e.target.elements.message.value
    socket.emit('send Message',message,(error)=>
    {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
       if(error)
       {
           return console.log(error)
       }
       
       console.log('Message Delivered!')
    })
})

$locationSendButton.addEventListener('click',()=>
{
   
    if(!navigator.geolocation)
    {
        return alert('This option is not available for your browser!')
    }
    $locationSendButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
       // console.log(position)

        socket.emit('getLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(callback)=>
        {
            console.log('Location shared!')
            $locationSendButton.removeAttribute('disabled')
        })
    })
})
const autoscroll=()=>
{
    
    const $newMessage=$messages.lastElementChild

    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=newMessage.offsetHeight + newMessageMargin

    const visibleHeight=$messages.offsetHeight
    const containerHeight=$messages.scrollHeight

    const scrollOffset=$messages.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset)
    {
        $messages.scrollTop=$messages.scrollHeight
    }
}
socket.on('message',(message)=>
{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforebegin',html)
    autoscroll()
})

socket.on('locationmessage',(locationmessage)=>
{
    console.log(locationmessage)
    const html=Mustache.render(locationmessagetemplate,{
        username:locationmessage.username,
        url:locationmessage.url,
        createdAt:moment(locationmessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforebegin',html)
    autoscroll()
})
socket.on('roomData',({room,users})=>
{
  const html=Mustache.render(sidebarTemplate,{
      room,
      users
  })
  document.querySelector("#side-bar").innerHTML=html
})
socket.emit('join',{username,room},(error)=>
{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})