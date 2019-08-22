<template>
  <b-input-group class="input-group" >
    <b-form-input
      type="search"
      id="filterInput"
      placeholder="Type to Search"
    ></b-form-input>
    <b-input-group-append>
      <b-button @click="searchRecord">Search</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: 'SearchBar',
  methods: {
    searchRecord () {
      console.log('Click search button')
    }
  }
}
</script>

<style scoped>
.input-group {
  align-self: flex-start;
}
</style>
