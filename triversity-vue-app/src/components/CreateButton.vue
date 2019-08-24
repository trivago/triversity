<template>
  <div class="create__button">
    <b-button @click="$router.push('AddProjectPage')">Create</b-button>
  </div>
</template>

<script>
export default {
  name: 'CreateButton',
  methods: {
    createRecord () {
      console.log('Click Create Btn')
    }
  }
}
</script>

<style scoped>
  .create__button {
    align-self: flex-start;
  }
</style>
