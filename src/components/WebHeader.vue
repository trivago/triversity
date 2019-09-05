<template>
  <div class="header-container">
    <div class="align-content-center triversity" @click="goHome">
      <span class="color--trivago-blue">tri</span>
      <span class="color--trivago-orange">ver</span>
      <span class="color--trivago-red">sity</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "WebHeader",
  methods: {
    goHome: function() {
      this.$router.push({ name: "ProjectListView" });
      window.location.reload();
    }
  }
};
</script>

<style scoped>
.header-container {
  box-sizing: border-box;
  background-color: white;
  padding: 2em;
  height: auto;
  width: 100%;
}
.triversity {
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  margin: auto;
}
span {
  margin: 0;
  padding: 0;
  font-size: 2rem;
  font-weight: 900;
}
</style>
