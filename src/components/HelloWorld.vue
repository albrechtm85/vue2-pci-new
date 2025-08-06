


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
    initializeBridge() {
      const iframe = this.$refs.helloFrame;
      this.bridge = new IframeBridge(iframe);
      this.bridge.verifyApi().then((verified) => {
        this.apiVerified = verified;
      });
    },
    callIframeScript() {
      if (this.apiVerified && this.bridge) {
        this.bridge.getHelloMessage().then(result => {
          this.iframeResult = result;
        }).catch(err => {
          this.iframeResult = err.message;
        });
      } else {
        this.iframeResult = 'Iframe API not verified.';
      }
    }
  }
}
</script>


