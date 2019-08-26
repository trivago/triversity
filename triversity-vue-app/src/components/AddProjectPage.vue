<template>
  <div class="create-form--container">
    <span>Create a Project</span>
    <b-form @submit="onSubmit" v-if="show" class="project-form" >
      <b-form-group id="input-group-project-title" label="Project Title:" label-for="input-project-title">
        <b-form-input
          id="input-project-title"
          v-model="form.projectTitle"
          required
          placeholder="Enter Project Name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-university" label="University:" label-for="input-university">
        <div>
          <multiselect v-model="form.university" tag-placeholder="Add this as new University" placeholder="Search or add a new University" :options="universityOptions" :multiple="true" :taggable="true" @tag="addUniversity"></multiselect>
        </div>
      </b-form-group>

      <b-form-group id="input-group-mentor" label="Mentor Name:" label-for="input-mentor">
        <div>
          <multiselect v-model="form.mentor" tag-placeholder="Add this as new mentor" placeholder="Search or add a new mentor" :options="mentorOptions" :multiple="true" :taggable="true" @tag="addMentor"></multiselect>
        </div>
      </b-form-group>

      <b-form-group id="input-group-target-group" label="Target Group:" label-for="input-target-group">
        <div>
          <multiselect v-model="form.targetGroup" tag-placeholder="Add this as new target group" placeholder="Search or add a new target group" :options="targetGroupOptions" :multiple="true" :taggable="true" @tag="addTargetGroup"></multiselect>
        </div>
      </b-form-group>

      <b-form-group id="input-group-project-description" label="Project Description:" label-for="input-project-description">
        <b-form-textarea
          id="input-project-description"
          v-model="form.projectDescription"
          placeholder="Enter Project Description"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <div class="div-buttons">
        <b-button id="submit-button" type="submit" variant="primary">Submit</b-button>
        <b-button id="cancel-button" type="cancel" variant="danger" @click="$router.push({name: 'ProjectListView'})">Cancel</b-button>
      </div>
    </b-form>

  </div>
</template>

<script>
import VueAirtableService from './airtable-api/VueAirtableService'
import FilterAutocomplete from './FilterAutocomplete'

export default {
  name: 'AddProjectPage',
  components: {FilterAutocomplete},
  props: [
    'base'
  ],
  data () {
    return {
      apiUrl: 'https://api.airtable.com/v0/',
      apiKey: 'keyVzJe5qGOll341v',
      recordId: null,
      form: {
        projectTitle: '',
        university: [],
        mentor: [],
        employeeNumber: [],
        targetGroup: [],
        projectDescription: ''
      },
      uniIdNameMap: null,
      uniNameIdMap: null,
      uniTable: [],
      tgIdNameMap: null,
      tgNameIdMap: null,
      tgTable: [],
      mentorIdNameMap: null,
      mentorNameIdMap: null,
      mentorTable: [],
      targetGroupOptions: [],
      universityOptions: [],
      mentorOptions: [],
      show: true
    }
  },
  mounted: function () {
    this.mapData()
    this.getTargetGroup()
    this.getUniversities()
    this.getMentors()
    this.recordId = this.$route.params.recordId
    if (this.recordId != null) {
      console.log('Edit Mode')
      this.fillInputForm(this.recordId)
    } else {
      console.log('Create Mode')
    }
  },
  methods: {
    async fillInputForm (recordId) {
      var response = await VueAirtableService.getRecord('Project', recordId)
        .catch(e => {
          console.log('Error: ' + e)
        })
      if (response.status === 200) {
        this.form.projectTitle = response.data.fields.Name
        this.form.university = response.data.fields['Universities']
        this.form.mentor = response.data.fields['Mentors']
        this.form.employeeNumber = response.data.fields['MentorsEmpNum']
        this.form.targetGroup = response.data.fields['TargetGroups']
        this.form.projectDescription = response.data.fields['Project Description']
        this.uniTable = response.data.fields.uniTable
        this.mentorTable = response.data.fields.mentorTable
        this.tgTable = response.data.fields.tgTable
      }
    },
    async getTargetGroup () {
      var response = await VueAirtableService.getRecords('TargetGroup')
      response.data.records.forEach((record) => {
        this.targetGroupOptions.push(record.fields['Name'])
      })
    },
    async getUniversities () {
      var response = await VueAirtableService.getRecords('University')
      response.data.records.forEach((record) => {
        this.universityOptions.push(record.fields['Name'])
      })
    },
    async getMentors () {
      var response = await VueAirtableService.getRecords('Mentor')
      response.data.records.forEach((record) => {
        this.mentorOptions.push(record.fields['Name'])
      })
    },
    async onSubmit (evt) {
      evt.preventDefault()

      this.uniTable = []
      for (var i = 0; i < this.form.university.length; i++) {
        this.uniTable.push(this.uniNameIdMap.get(this.form.university[i]))
      }

      this.tgTable = []
      for (var j = 0; j < this.form.targetGroup.length; j++) {
        this.tgTable.push(this.tgNameIdMap.get(this.form.targetGroup[j]))
      }

      this.mentorTable = []
      for (var k = 0; k < this.form.mentor.length; k++) {
        this.mentorTable.push(this.mentorNameIdMap.get(this.form.mentor[k]))
      }

      var data = {
        'fields': {
          'Name': this.form.projectTitle,
          'tgTable': this.tgTable,
          'mentorTable': this.mentorTable,
          'uniTable': this.uniTable,
          'Project Description': this.form.projectDescription
        }
      }

      console.log(data)

      var response

      if (this.recordId != null) {
        console.log('Edit Mode')
        response = await VueAirtableService.updateRecord('Project', this.recordId, data)
      } else {
        console.log('Create Mode')
        response = await VueAirtableService.createRecord('Project', data)
      }

      if (response.status === 200) {
        if (this.recordId != null) {
          console.log('Edit Mode')
          alert('Modified Data')
        } else {
          console.log('Create Mode')
          alert('Project added to the list')
        }
        this.$router.go(-1)
      }
    },
    async mapData () {
      // this.uniIdNameMap = new Map()
      this.uniNameIdMap = new Map()
      var uniResponse = await VueAirtableService.getRecords('University')

      uniResponse.data.records.forEach((record) => {
        // this.uniIdNameMap.set(record.id, record.fields.Name)
        this.uniNameIdMap.set(record.fields.Name, record.id)
      })

      this.tgNameIdMap = new Map()
      var tgResponse = await VueAirtableService.getRecords('TargetGroup')

      tgResponse.data.records.forEach((record) => {
        this.tgNameIdMap.set(record.fields.Name, record.id)
      })

      this.mentorNameIdMap = new Map()
      var mentorResponse = await VueAirtableService.getRecords('Mentor')

      mentorResponse.data.records.forEach((record) => {
        this.mentorNameIdMap.set(record.fields.Name, record.id)
      })
    },
    addUniversity (uniName) {

    },
    addTargetGroup (targetGroupName) {

    },
    addMentor (mentorName) {

    }
  }
}
</script>

<style>
  .create-form--container {
    box-sizing: border-box;
    width: fit-content;
    min-width: 80%;
    background-color: white;
    height: fit-content;
    margin: 2em 10% 3em 10%;
    padding: 2em;
    border-radius: 20px;
  }
  .create-form--container > span:first-child {
    box-sizing: border-box;
    width: 100%;
    font-weight: 700;
    font-size: 1.5rem;
    color: #696969;
    float: left;
    padding: 2rem 0;
    text-align: left;
  }
  .project-form {
    box-sizing: border-box;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
  .div-buttons {
    width: 100%;
  }
  .div-buttons > button {
    float: right;
    margin-left: 10px;
  }

</style>
