


<template>
  <div>
    <iframe ref="helloFrame" src="/hello.html" width="100%" height="400" style="border:none;"></iframe>
    <button @click="callIframeScript">Call iframe script</button>
    <div v-if="iframeResult">Result: {{ iframeResult }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeResult: '',
      iframeContext: null
    }
  },
  mounted() {
    this.setIframeContext();
  },
  methods: {
    setIframeContext() {
      const iframe = this.$refs.helloFrame;
      if (iframe && iframe.contentWindow && iframe.contentWindow.iframeContext) {
        this.iframeContext = iframe.contentWindow.iframeContext;
      } else {
        // Try again after iframe loads
        iframe.addEventListener('load', () => {
          if (iframe.contentWindow.iframeContext) {
            this.iframeContext = iframe.contentWindow.iframeContext;
          }
        });
      }
    },
    callIframeScript() {
      if (this.iframeContext && this.iframeContext.getHelloMessage) {
        this.iframeResult = this.iframeContext.getHelloMessage();
      } else {
        this.iframeResult = 'Context or function not available yet.';
      }
    }
  }
}
</script>


