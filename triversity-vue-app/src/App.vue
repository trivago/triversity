<template>
  <div id="app">
    <WebHeader/>
    <router-view/>
    <WebFooter/>
  </div>
</template>

<script>
import WebHeader from './components/WebHeader'
import WebFooter from './components/WebFooter'

export default {
  name: 'App',
  components: {
    WebHeader,
    WebFooter
  }
}
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  background-color: #f3f3f3
}
#app {
  box-sizing: border-box;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100% !important;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
}
</style>
