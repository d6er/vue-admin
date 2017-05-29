import WebSocketPromise from './WebSocketPromise'

let wsp = new WebSocketPromise('ws://localhost:8181')

export default {
  call (data) {
    return wsp.send(data) // return a Promise
  }
}
