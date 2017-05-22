// todo: create npm module
// http://stackoverflow.com/questions/13417000/synchronous-request-with-websockets
let jobid = 0
let jobs = []
let ws

// Client
if (typeof window !== 'undefined') {
  
  // todo: auto reconnect
  ws = new WebSocket(`ws://localhost:8181`)
  
  ws.onmessage = function(event) {
    
    const data = JSON.parse(event.data)
    
    if (data.resolve) {
      jobs[data.jobid].resolve(data.resolve)
    } else if (data.reject) {
      jobs[data.jobid].reject(data.reject)
    }
    // todo: delete completed job func
  }
}

export default {
  send (action, payload) {
    
    jobid++
    
    ws.send(JSON.stringify({
      jobid: jobid,
      action: action,
      payload: payload
    }))
    
    return new Promise((resolve, reject) => {
      jobs[jobid] = {
        resolve: resolve,
        reject: reject
      }
    })
  }
}
