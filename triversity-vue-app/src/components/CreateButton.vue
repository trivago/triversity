<template>
  <div id="divdiv" class="divclass">
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
  .divclass {
    align-self: flex-start;
  }
/*div {*/

/*}*/

/*#divdiv {*/

/*  }*/

/*.divclass {*/

/*}*/

/*  .divclass>b-button {*/

/*  }*/

/*  a,*/
/*  a:hover,*/
/*  a:visited,*/
/*  a:focus {*/
/*    color: #000;*/
/*    text-decoration: none;*/
/*  }*/
</style>
