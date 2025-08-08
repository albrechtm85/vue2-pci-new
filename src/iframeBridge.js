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
    this.init();
  }

  init() {
    this._send('validateApi');
    this._once('api', (data) => {
      if (Array.isArray(data.methods)) {
        // Verify required API
        const missing = REQUIRED_API.filter(fn => !data.methods.includes(fn));
        if (missing.length > 0) {
          console.error('Missing required API methods in iframe:', missing);
          this.apiCheckDone = false;
          return;
        }
        // Dynamically create API methods
        data.methods.forEach(fnName => {
          this[fnName] = (...args) => this._callApi(fnName, ...args);
        });
        this.apiCheckDone = true;
      } else {
        this.apiCheckDone = false;
      }
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
