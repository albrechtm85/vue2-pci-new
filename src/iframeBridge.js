// iframeBridge.js

const REQUIRED_API = ['getHelloMessage', 'getTime'];


class IframeBridge {
  constructor(iframe) {
    this.iframe = iframe;
    this.apiVerified = false;
    this.apiCheckDone = false;
    this.pending = {};
    window.addEventListener('message', this._handleMessage.bind(this));

    // Dynamically create API methods
    REQUIRED_API.forEach(fnName => {
      this[fnName] = (...args) => {
        return this._callApi(fnName, ...args);
      };
    });
  }

  verifyApi() {
    return new Promise((resolve) => {
      this._send('verifyApi', { required: REQUIRED_API });
      this._once('apiVerified', (payload) => {
        this.apiVerified = payload.result;
        this.apiCheckDone = true;
        resolve(payload.result);
      });
    });
  }

  _callApi(fnName, ...args) {
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
      // For apiVerified, pass the whole payload
      if (event.data.type === 'apiVerified') {
        this.pending[event.data.type](event.data);
      } else {
        this.pending[event.data.type](event.data.result);
      }
      delete this.pending[event.data.type];
    }
  }
}

export default IframeBridge;
