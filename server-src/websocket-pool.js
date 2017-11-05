const sockets = []

const methods = {
  
  add: (session_id, user_id, ws) => {
    let obj = {
      session_id: session_id,
      user_id: user_id,
      ws: ws
    }
    sockets.push(obj)
  },

  send: (user_id, message) => {
    sockets.filter(s => s.user_id == user_id).map(s => {
      if (s.ws.readyState != 1) return
      s.ws.send(JSON.stringify({ job_id: 0, message: message }))
    })
  }
}

module.exports = methods
