


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
      bridge: null
    }
  },
  mounted() {
  },
  methods: {
    async initializeBridge() {
      const iframe = this.$refs.helloFrame;
      this.bridge = new IframeBridge(iframe);
    },
    callIframeScript() {
      this.bridge.getResponse().then(result => {
        this.iframeResult = result;
      }).catch(err => {
        this.iframeResult = err.message;
      });
    }
  }
}
</script>


