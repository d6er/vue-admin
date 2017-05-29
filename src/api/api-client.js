import WebSocketPromise from './WebSocketPromise'
import config from '../../config'

let wsp

connect()

// https://stackoverflow.com/questions/3780511/reconnection-of-client-when-server-reboots-in-websocket
// todo: ping - pong
function connect () {
  wsp = new WebSocketPromise(config.websocket_url)
  wsp.onclose = function () {
    console.log('WebSocket closed.')
    setTimeout(function () {
      console.log('WebSocket reconnecting...')
      connect()
    }, 5000);
  }
}

export default {
  call (data) {
    return wsp.send(data) // return a Promise
  }
}
