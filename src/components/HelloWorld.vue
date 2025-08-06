


<template>
  <div>
    <iframe ref="helloFrame" src="/hello.html" width="100%" height="400" style="border:none;" sandbox="allow-scripts" @load="initializeBridge"></iframe>
    <button @click="callIframeScript">Call iframe script</button>
    <div v-if="iframeResult">Result: {{ iframeResult }}</div>
  </div>
</template>

<script>
import IframeBridge from '../iframeBridge';

export default {
  data() {
    return {
      iframeResult: '',
      bridge: null,
      apiVerified: false
    }
  },
  mounted() {
  },
  methods: {
    async initializeBridge() {
      const iframe = this.$refs.helloFrame;
      this.bridge = new IframeBridge(iframe);
      const methods = await this.bridge.init();
      this.apiVerified = Array.isArray(methods) && methods.length > 0;
    },
    callIframeScript() {
      if (this.apiVerified && this.bridge && typeof this.bridge.getResponse === 'function') {
        this.bridge.getResponse().then(result => {
          this.iframeResult = result;
        }).catch(err => {
          this.iframeResult = err.message;
        });
      } else {
        this.iframeResult = 'Iframe API not verified or method not available.';
      }
    }
  }
}
</script>


