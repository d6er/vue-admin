let ws
if (typeof window !== 'undefined') {
  ws = new WebSocket(`ws://localhost:8181`)
}

export default {
  signUp (cb) {
    console.log('api:signUp()')
    
    //ws.send('message from signUp()')
    
    let obj = {
      username: 'd6er@qq.com',
      password: 'pA$$wOrD'
    }
    
    ws.send(JSON.stringify(obj))
    
    cb()
  }
}