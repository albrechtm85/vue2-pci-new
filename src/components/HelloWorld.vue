


<template>
  <div>
    <iframe ref="helloFrame" src="/hello.html" width="100%" height="400" style="border:none;"></iframe>
    <button @click="callIframeScript">Call iframe script</button>
    <div v-if="iframeResult">Result: {{ iframeResult }}</div>
  </div>
</template>

<script>
import iframeBridge from '../iframeBridge';

export default {
  data() {
    return {
      iframeResult: '',
      iframeContext: null,
      apiVerified: false
    }
  },
  mounted() {
    this.setIframeContext();
  },
  methods: {
    setIframeContext() {
      const iframe = this.$refs.helloFrame;
      const setContext = () => {
        const ctx = iframe.contentWindow.iframeContext;
        if (iframeBridge.verifyApi(ctx)) {
          this.iframeContext = ctx;
          this.apiVerified = true;
        } else {
          this.apiVerified = false;
        }
      };
      if (iframe && iframe.contentWindow) {
        if (iframe.contentWindow.iframeContext) {
          setContext();
        } else {
          iframe.addEventListener('load', setContext);
        }
      }
    },
    callIframeScript() {
      if (this.apiVerified) {
        try {
          this.iframeResult = iframeBridge.call(this.iframeContext, 'getHelloMessage');
        } catch (e) {
          this.iframeResult = e.message;
        }
      } else {
        this.iframeResult = 'Iframe API not verified.';
      }
    }
  }
}
</script>


