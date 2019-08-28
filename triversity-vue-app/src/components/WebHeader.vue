<template>
  <div class="header-container" @click="goHome">
    <span id="title--blue">tri</span><span id="title--orange">ver</span><span id="title--red">sity</span><br>
  </div>
</template>

<script>
export default {
  name: 'WebHeader',
  methods: {
    goHome () {
      this.$router.push({name: 'ProjectListView'})
      window.location.reload()
    }
  }
}

</script>

<style scoped>
  .header-container {
    box-sizing: border-box;
    background-color: white;
    padding: 2em;
    height: auto;
  }
  span {
    margin: 0;
    padding: 0;
    font-size: 2rem;
    font-weight: 900;
  }
  #title--blue {
    color: #007FAF;
  }
  #title--orange {
    color: #F48F00;
  }
  #title--red {
    color: #CA4A38;
  }
</style>
