<template>
  <b-input-group class="input-group" >
    <b-form-input
      type="search"
      id="filterInput"
      v-model="searchInputText"
      placeholder="Type to search"
    ></b-form-input>
    <b-input-group-append>
      <b-button @click="searchRecord">Search</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: 'SearchBar',
  data () {
    return {
      searchInputText: ''
    }
  },
  methods: {
    searchRecord () {
      this.sendMessageToParent(this.searchInputText)
    },
    sendMessageToParent (arg) {
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, this.$options.name, arg)
    }
  }
}
</script>

<style scoped>
.input-group {
  align-self: flex-start;
}
</style>
