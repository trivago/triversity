<template>
  <div>
    <label class="typo__label">
      <small>{{ fieldVisibleName[field] }}</small>
    </label>
    <multiselect
      v-model="selectedValue"
      :options="options"
      :multiple="multiple"
      :taggable="taggable"
      :class="field"
      placeholder="select one filter"
      @input="sendToParent"
      @select="addToSelectedValue"
      @remove="removeSelectedFilter"
    ></multiselect>
  </div>
</template>

<script>
export default {
  name: "FilterMultiselect",
  props: ["field", "options", "multiple", "taggable"],
  data: function() {
    return {
      fieldVisibleName: {
        tgTable: "Target Group",
        uniTable: "University",
        mentorTable: "Mentor"
      },
      selectedValue: null
    };
  },
  methods: {
    addToSelectedValue: function(selectedOption, id) {
      this.selectedValue = selectedOption;
    },
    removeSelectedFilter: function(removedOption, id) {
      var messageTitle = "messageFrom" + this.$options.name;
      this.$emit(messageTitle, this.field, "remove");
    },
    sendToParent: function(selectedOption, id) {
      if (selectedOption.length < 1) return;
      this.selectedValue = selectedOption;

      if (selectedOption.length > 1) {
        selectedOption.splice(0, 1);
      }
      var query = `FIND('${selectedOption}', {${this.field}})`;
      var messageTitle = "messageFrom" + this.$options.name;
      this.$emit(messageTitle, this.field, query);
      console.log(query);
      this.selectedValue = selectedOption;
    },
    resetFilters: function() {
      this.selectedValue = null;
    }
  }
};
</script>

<style scoped>
label.typo__label {
  width: 100%;
  text-align: start;
  margin: 0;
  padding: 0;
}

.multiselect.tgTable >>> .multiselect__tags span.multiselect__tag,
.multiselect.tgTable >>> .multiselect__tags i.multiselect__tag-icon:hover {
  background: #007faf;
}
.multiselect.uniTable >>> .multiselect__tags span.multiselect__tag,
.multiselect.uniTable >>> .multiselect__tags i.multiselect__tag-icon:hover {
  background: #ca4a38;
}
.multiselect.mentorTable >>> .multiselect__tags span.multiselect__tag,
.multiselect.mentorTable >>> .multiselect__tags i.multiselect__tag-icon:hover {
  background: #f48f00;
}

.multiselect.tgTable >>> .multiselect__option.multiselect__option--highlight,
.multiselect.tgTable
  >>> .multiselect__option.multiselect__option--highlight:after,
.multiselect.uniTable >>> .multiselect__option.multiselect__option--highlight,
.multiselect.uniTable
  >>> .multiselect__option.multiselect__option--highlight:after,
.multiselect.mentorTable
  >>> .multiselect__option.multiselect__option--highlight,
.multiselect.mentorTable
  >>> .multiselect__option.multiselect__option--highlight:after {
  background: #808080;
}

.multiselect.tgTable
  >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight,
.multiselect.tgTable
  >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight:after,
.multiselect.uniTable
  >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight,
.multiselect.uniTable
  >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight:after,
.multiselect.mentorTable
  >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight,
.multiselect.mentorTable
  >>> .multiselect__option.multiselect__option--selected.multiselect__option--highlight:after {
  background: #ff6a6a;
}

.multiselect.tgTable >>> .multiselect__tag-icon::after,
.multiselect.uniTable >>> .multiselect__tag-icon::after,
.multiselect.mentorTable >>> .multiselect__tag-icon::after {
  color: #fff;
}
</style>
