// iframeBridge.js

const REQUIRED_API = ['getHelloMessage', 'getTime'];

export default {
  verifyApi(context) {
    if (!context) return false;
    return REQUIRED_API.every(fn => typeof context[fn] === 'function');
  },
  call(context, fnName, ...args) {
    if (!context || typeof context[fnName] !== 'function') {
      throw new Error(`Function ${fnName} not available in iframe context.`);
    }
    return context[fnName](...args);
  }
};
