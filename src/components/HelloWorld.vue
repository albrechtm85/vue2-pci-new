


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
      iframeResult: ''
    }
  },
  methods: {
    callIframeScript() {
      const iframe = this.$refs.helloFrame;
      if (iframe && iframe.contentWindow && iframe.contentWindow.getHelloMessage) {
        this.iframeResult = iframe.contentWindow.getHelloMessage();
      } else {
        this.iframeResult = 'Function not available yet.';
      }
    }
  }
}
</script>


