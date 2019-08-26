<template>
    <div class="md-list-item-text">
      <span>{{ title }}</span>
      <span v-if="date.start || date.end" class="text-muted"><small>{{ date.start }} ~ {{ date.end }}</small></span>
    </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: [
    'title',
    'date'
  ],
  mounted: function () {
  }
}
</script>

<style scoped>

</style>
