<template>
  <div class="header-container">
    <span id="title--blue">tri</span><span id="title--orange">ver</span><span id="title--red">sity</span>
  </div>
</template>

<script>
export default {
  name: 'WebHeader'
}
</script>

<style scoped>
  .header-container {
    box-sizing: border-box;
    background-color: white;
    padding: .5em;
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
