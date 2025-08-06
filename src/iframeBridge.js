// iframeBridge.js

const REQUIRED_API = ['getInstance', 'getResponse', 'getState', 'oncompleted'];


class IframeBridge {
  constructor(iframe) {
    this.iframe = iframe;
    this.pending = {};
    window.addEventListener('message', this._handleMessage.bind(this));

    // Dynamically create API methods
    REQUIRED_API.forEach(fnName => {
      this[fnName] = (...args) => {
        return this._callApi(fnName, ...args);
      };
    });
    this.apiCheckDone = false;
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

  init() {
    return new Promise((resolve) => {
      this._send('getInstance');
      this._once('instance', (data) => {
        // Dynamically create API methods
        if (Array.isArray(data.methods)) {
          data.methods.forEach(fnName => {
            this[fnName] = (...args) => this._callApi(fnName, ...args);
          });
        }
        this.apiCheckDone = true;
        resolve(data.methods);
      });
    });
  }

  _callApi(fnName, ...args) {
    return new Promise((resolve, reject) => {
      if (!this.apiCheckDone) {
        return reject(new Error('Iframe API not verified.'));
      }
      this._send('call', { fnName, args });
      this._once('callResult', (data) => {
        resolve(data.result);
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
      this.pending[event.data.type](event.data);
      delete this.pending[event.data.type];
    }
  }
}

export default IframeBridge;
