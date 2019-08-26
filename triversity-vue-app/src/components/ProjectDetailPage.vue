<template>
<div>

</div>
</template>

<script>
import VueAirtableService from './airtable-api/VueAirtableService'

export default {
  name: 'ProjectDetailPage',
  props: [
    'base'
  ],
  data () {
    return {
      apiUrl: 'https://api.airtable.com/v0/',
      apiKey: 'keyVzJe5qGOll341v',
      recordId: null,
      projectTitle: '',
      targetGroup: [],
      mentor: [],
      university: [],
      projectDescription: '',
      startDate: '',
      endDate: ''
    }
  },
  mounted: function () {
    this.recordId = this.$route.params.recordId
    this.getData(this.recordId)
  },
  methods: {
    async getData (recordId) {
      console.log('record Id : ' + recordId)
      var response = await VueAirtableService.getRecord('Project', recordId)
      if (response.status === 200) {
        this.projectTitle = response.data.fields.Name
        this.targetGroup = response.data.fields['TargetGroups']
        this.mentor = response.data.fields['Mentors']
        this.university = response.data.fields['Universities']
        this.projectDescription = response.data.fields['Project Description']
        this.startDate = response.data.fields['startDate']
        this.endDate = response.data.fields['endDate']

        this.printData()
      }
    },
    printData () {
      console.log('projectTitle       : ' + this.projectTitle)
      console.log('targetGroup        : ' + this.targetGroup)
      console.log('mentor             : ' + this.mentor)
      console.log('university         : ' + this.university)
      console.log('projectDescription : ' + this.projectDescription)
      console.log('startDate          : ' + this.startDate)
      console.log('endDate            : ' + this.endDate)
    }
  }
}
</script>

<style scoped>

</style>
