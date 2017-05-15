let ws
if (typeof window !== 'undefined') {
  ws = new WebSocket(`ws://localhost:8181`)
}

export default {
  signUp (cb) {
    console.log('api:signUp()')
    ws.send('send test')
    cb()
  }
}