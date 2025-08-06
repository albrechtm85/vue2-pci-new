// iframeBridge.js

const REQUIRED_API = ['getHelloMessage', 'getTime'];

class IframeBridge {
  constructor(iframe) {
    this.iframe = iframe;
    this.apiVerified = false;
    this.apiCheckDone = false;
    this.pending = {};
    window.addEventListener('message', this._handleMessage.bind(this));
  }

  verifyApi() {
    return new Promise((resolve) => {
      this._send('verifyApi', { required: REQUIRED_API });
      this._once('apiVerified', (payload) => {
        console.log('API verification result:', payload);
        
        this.apiVerified = payload;
        this.apiCheckDone = true;
        resolve(payload);
      });
    });
  }

  call(fnName, ...args) {
    return new Promise((resolve, reject) => {
      if (!this.apiCheckDone || !this.apiVerified) {
        return reject(new Error('Iframe API not verified.'));
      }
      this._send('call', { fnName, args });
      this._once('callResult', (result) => {
        resolve(result);
      });
    });
  }

  _send(type, payload = {}) {
    this.iframe.contentWindow.postMessage({ type, ...payload }, '*');
  }

  _once(type, cb) {
    this.pending[type] = cb;
  }

  _handleMessage(event) {
    if (!event.data || !event.data.type) return;
    if (this.pending[event.data.type]) {
      this.pending[event.data.type](event.data.result);
      delete this.pending[event.data.type];
    }
  }
}

export default IframeBridge;
