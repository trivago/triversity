<template>
    <div style="width: 100%">
      <div v-if="header" class="md-layout">
        <div class="md-layout-item list-item__date">
          <md-button class="md-text-button" @click="sendToParentSort('startDate')">Start Date</md-button>
        </div>
        <div class="md-layout-item list-item__date">
          <md-button class="md-text-button"  @click="sendToParentSort('endDate')">End Date</md-button>
        </div>
        <div class="md-layout-item list-item__title list-item--text--center">
          <md-button class="md-text-button button--fill-width" @click="sendToParentSort('Name')">Project</md-button>
        </div>
      </div>
      <div v-else class="md-layout">
        <div class="md-layout-item text-muted list-item__date">
          <small>{{ date.start }}</small>
        </div>
        <div class="md-layout-item text-muted list-item__date">
          <small>{{ date.end }}</small>
        </div>
        <div class="md-layout-item list-item__title">
          <small>{{ title }}</small>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: [
    'header',
    'title',
    'date',
    'sort'
  ],
  methods: {
    sendToParentSort: function (field) {
      var direction = ''
      if (this.sort.field === field) {
        if (this.sort.direction === 'asc') {
          direction = 'desc'
        } else {
          direction = 'asc'
        }
      } else {
        direction = this.sort.direction
      }

      // var query = 'sort%5B0%5D%5Bfield%5D=' + field + '&sort%5B0%5D%5Bdirection%5D=' + direction
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, field, direction)
    }
  }
}
</script>

<style scoped>
  .md-button {
    padding: 0;
    margin: 0;
  }
  .button--fill-width {
    display: block;
    width: 100%;
  }
  .md-button:active,
  .md-button:focus {
    outline: none;
  }
  .list-item__date {
    text-align: center;
    min-width: 100px;
    vertical-align: middle;
  }
  .list-item__date:nth-child(2) {
    padding-right: 1em;
  }
  .list-item__title {
    flex: 8;
    width: 100%;
  }
  .md-18 {
    font-size: 18px !important;
  }
  .list-item--text--center {
    text-align: center;
  }
</style>
