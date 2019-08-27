<template>
  <div>
    <label class="typo__label"><small>{{ fieldVisibleName[field] }}</small></label>
    <multiselect v-model="selectedValue"
                 :options="options"
                 :multiple="multiple"
                 :taggable="taggable"
                 :class="field"
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
      fieldVisibleName: {
        'tgTable' : 'Target Group',
        'uniTable' : 'University',
        'mentorTable' : 'Mentor'
      },
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
      var query = `FIND('${selectedOption}', {${this.field}})`
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, this.field, query)
      console.log(query)
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

.multiselect.TargetGroups >>> .multiselect__tags span.multiselect__tag,
.multiselect.TargetGroups >>> .multiselect__tags i.multiselect__tag-icon:hover {
  background: #007FAF;
}
.multiselect.Universities >>> .multiselect__tags span.multiselect__tag,
.multiselect.Universities >>> .multiselect__tags i.multiselect__tag-icon:hover {
  background: #F48F00;
}
.multiselect.Mentors >>> .multiselect__tags span.multiselect__tag,
.multiselect.Mentors >>> .multiselect__tags i.multiselect__tag-icon:hover {
  background: #CA4A38;
}

.multiselect.TargetGroups >>> .multiselect__option.multiselect__option--highlight,
.multiselect.TargetGroups >>> .multiselect__option.multiselect__option--highlight:after,
.multiselect.Universities >>> .multiselect__option.multiselect__option--highlight,
.multiselect.Universities >>> .multiselect__option.multiselect__option--highlight:after,
.multiselect.Mentors >>> .multiselect__option.multiselect__option--highlight,
.multiselect.Mentors >>> .multiselect__option.multiselect__option--highlight:after {
  background: #808080;
}

.multiselect.TargetGroups >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight,
.multiselect.TargetGroups >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight:after,
.multiselect.Universities >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight,
.multiselect.Universities >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight:after,
.multiselect.Mentors >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight,
.multiselect.Mentors >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight:after {
  background: #FF6A6A;
}

.multiselect.TargetGroups >>> .multiselect__tag-icon::after,
.multiselect.Universities >>> .multiselect__tag-icon::after,
.multiselect.Mentors >>> .multiselect__tag-icon::after {
  color: #fff;
}
</style>
