<template>
  <div class="header-container">
    <div class="align-content-center triversity" @click="goHome">
      <span id="title--blue">tri</span><span id="title--orange">ver</span><span id="title--red">sity</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebHeader',
  methods: {
    goHome: function () {
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
    width: 100%
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
