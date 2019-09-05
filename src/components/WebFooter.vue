<template>
  <footer class="d-flex justify-content-center mt-auto footer-container">
    <span>Trivago University Project Management Tool</span>
  </footer>
</template>

<script>
export default {
  name: "WebFooter"
};
</script>

<style scoped>
.footer-container {
  box-sizing: border-box;
  bottom: 0;
  width: 100%;
  background-color: #37454d;
  height: fit-content;
  padding: 2em;
}
.footer-container > span {
  font-size: 0.8em;
  color: #fff;
}
</style>
