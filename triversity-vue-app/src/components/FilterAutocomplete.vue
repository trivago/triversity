<template>
  <div class="md-layout-item">
    <md-autocomplete
      v-model="searchText"
      :md-options="options"
      md-dense
      @md-opened="resetSearchTerm"
      @md-selected="setFilter"
      md-input-id="searchTerm">
      <label>{{ field }}</label>
    </md-autocomplete>
  </div>
</template>

<script>

export default {
  name: 'FilterAutocomplete',
  props: [
    'field',
    'options'
  ],
  data: function () {
    return {
      searchText: ''
    }
  },
  methods: {
    setFilter: function (value) {
      this.sendMessageToParent(value)
    },
    resetSearchTerm: function () {
      this.searchText = ''
      Array.from(document.getElementsByClassName('md-chip')).forEach((chip) => {
        chip.classList.remove('md-duplicated')
      })
    },
    sendMessageToParent (arg) {
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, this.field, arg)
    }
  }
}
</script>

<style scoped>

</style>
