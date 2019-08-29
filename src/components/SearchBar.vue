<template>
  <b-input-group>
    <b-form-input
      type="search"
      v-model="searchInputText"
      placeholder="Type to search">
    </b-form-input>
    <b-input-group-append>
      <b-button @click="searchRecord">Search</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'SearchBar',
  data () {
    return {
      searchInputText: ''
    }
  },
  watch: {
    searchInputText: function (newText) {
      this.sendMessageToParent(newText)
    }
  },
  methods: {
    searchRecord () {
      this.sendMessageToParent(this.searchInputText)
    },
    sendMessageToParent: _.debounce(
      function (arg) {
        var messageTitle = 'messageFrom' + this.$options.name
        this.$emit(messageTitle, this.$options.name, arg)
      },
      500
    )
  }
}
</script>
