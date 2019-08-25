<template>
  <div class="center">
    <div class="content">
      <md-icon class="md-size-2x">sentiment_dissatisfied</md-icon>
      <span>No Results Found</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoResultsFound'
}
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body{
    height: 100%;
  }
  .center{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
  .content{
    position: relative;
    color: #00000090;
  }
  .content span {
    font-size: 2rem;
    line-height: 48px;
    vertical-align: middle;
  }
</style>
