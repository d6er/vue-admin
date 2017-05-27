import WebSocketPromise from './WebSocketPromise'

let wsp = new WebSocketPromise('ws://localhost:8181')

export default {
  call (data) {
    console.log('api-client call()')
    console.dir(data)
    return wsp.send(data) // return a Promise
  }
}
