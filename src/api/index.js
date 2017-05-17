// http://stackoverflow.com/questions/13417000/synchronous-request-with-websockets
let jobid = 0
let jobs = []
let ws

if (typeof window !== 'undefined') {
  ws = new WebSocket(`ws://localhost:8181`)
  ws.onmessage = function(event) {
    const data = JSON.parse(event.data)
    jobs[data.jobid](data.message)
    // todo: delete completed job func
  }
}

export default {
  send (action, data) {
    
    jobid++
    
    console.log('api jobid:' + jobid + ' action:' + action)
    
    ws.send(JSON.stringify({ jobid: jobid, message: data }))
    
    return new Promise((resolve, reject) => {
      jobs[jobid] = resolve
    })
  }
}
