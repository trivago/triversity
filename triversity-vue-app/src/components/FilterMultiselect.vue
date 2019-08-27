<template>
  <div>
    <label class="typo__label"><small>{{ field }}</small></label>
    <multiselect v-model="selectedValue"
                 :options="options"
                 :multiple="multiple"
                 :taggable="taggable"
                 placeholder="select one filter"
                 @input="sendToParent"
                 @select="addToSelectedValue"
                 @remove="removeSelectedFilter"></multiselect>
  </div>
</template>

<script>
export default {
  name: 'FilterMultiselect',
  props: [
    'field',
    'options',
    'multiple',
    'taggable'
  ],
  data: function () {
    return {
      selectedValue: null
    }
  },
  methods: {
    addToSelectedValue: function (selectedOption, id) {
      this.selectedValue = selectedOption
    },
    removeSelectedFilter: function (removedOption, id) {
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, this.field, 'remove')
    },
    sendToParent: function (selectedOption, id) {
      if (selectedOption.length < 1) return
      console.log(selectedOption)
      this.selectedValue = selectedOption

      if (selectedOption.length > 1) {
        selectedOption.splice(0, 1)
      }
      var query = 'FIND(\'' + selectedOption + '\', {' + this.field + '})'
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, this.field, query)
      this.selectedValue = selectedOption
    },
    resetFilters: function () {
      this.selectedValue = null
    }
  }
}
</script>

<style scoped>
label.typo__label {
  width: 100%;
  text-align: start;
  margin: 0;
  padding: 0;
}
</style>
