<template>
  <div class="create-form--container">
    <span>Create a Project</span>
    <b-form @submit="onSubmit" v-if="show" class="project-form">
      <b-form-group id="input-group-project-title" label="Project Title:" label-for="input-project-title">
        <b-form-input
          id="input-project-title"
          v-model="form.projectTitle"
          required
          placeholder="Enter Project Name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-university" label="University:" label-for="input-university">
        <b-form-select
          id="input-university"
          v-model="form.university"
          :options="universities"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-mentor" label="Mentor Name:" label-for="input-mentor">
        <b-form-input
          id="input-mentor"
          v-model="form.mentor"
          placeholder="Enter Mentor Name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-emp-num" label="Employee Number:" label-for="input-emp-num">
        <b-form-input
          id="input-emp-num"
          v-model="form.employeeNumber"
          placeholder="Enter Mentor's Employee Number"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-target-group" label="Target Group:" label-for="input-target-group">
        <b-form-select
          id="input-target-group"
          v-model="form.targetGroup"
          :options="targetGroups"
          required
        ></b-form-select>
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
import axios from 'axios'
import VueAirtableService from './airtable-api/VueAirtableService'

export default {
  name: 'AddProjectPage',
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
        university: null,
        mentor: '',
        employeeNumber: '',
        targetGroup: null,
        projectDescription: ''
      },
      universities: [{ text: 'Select University', value: null }],
      targetGroups: [{ text: 'Select One', value: null }, 'Tech', 'Marketing', 'Engineering', 'Finance'],
      show: true
    }
  },
  mounted: function () {
    this.getUniversityData()
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
        this.form.university = response.data.fields.University
        this.form.mentor = response.data.fields.Mentor
        this.form.employeeNumber = response.data.fields.EmpNum
        this.form.targetGroup = response.data.fields['Target Group']
        this.form.projectDescription = response.data.fields['Project Description']
      }

      // VueAirtableService.updateRecord('Project', recordId, data)
    },
    getUniversityData () {
      axios({
        url: this.apiUrl + this.base + '/University',
        headers: {
          'Authorization': 'Bearer keyVzJe5qGOll341v'
        }
      }).then((response) => {
        for (var i = 0; i < response.data.records.length; i++) {
          this.universities.push(response.data.records[i].fields.Name)
        }
      }).catch(e => {
        console.log('Error: ' + e)
      })
    },
    async onSubmit (evt) {
      evt.preventDefault()

      var data = {
        'fields': {
          'Name': this.form.projectTitle,
          'Target Group': this.form.targetGroup,
          'Mentor': this.form.mentor,
          'EmpNum': this.form.employeeNumber,
          'University': this.form.university,
          'Project Description': this.form.projectDescription
        }
      }
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
