<template>
<div class="detail-container">
  <div class="detail__project__title">
    <small>Project Title: </small><br/>
    <h2 class="no-margin"><strong>{{ projectTitle }}</strong></h2>
    <div class="button-group">
      <b-button variant="link" class="text-decoration-none no-padding"
                v-b-tooltip.hover title="Edit"
                @click="$router.push({ name: 'EditProjectPage', params: { recordId: recordId} })"><md-icon>edit</md-icon></b-button>
      <b-button variant="link" class="text-decoration-none no-padding" style="margin-left: 1em"
                v-b-tooltip.hover title="Delete"
                @click="onDelete(recordId)"><md-icon>delete</md-icon></b-button>
    </div>
  </div>
  <div class="flex-direction--row">
    <div class="flex-direction--column flex--weight-2">
      <md-card class="card--white flex--weight-8">
        <small>Project Description:</small>
        <p class="card__content" v-if="projectDescription">{{ projectDescription }}</p>
        <div class="detail__content" v-else>No project description</div>
      </md-card>
      <md-card class="card--white flex--weight-1">
        <small>Attachment:</small>
        <div class="card__content" v-if="attachments !== undefined">
          <a v-for="file in attachments" :key="file.id" v-bind:href="file.url" target="_blank">
            <md-chip class="margin--5-2" md-clickable md-click="" >{{ file.filename }}</md-chip>
          </a>
        </div>
        <div class="card__content" v-else>No attachment</div>
      </md-card>
    </div>
    <div class="flex-direction--column flex--weight-1">
      <md-card class="card--white flex--weight-1">
        <small>
          <md-icon v-if="targetGroups" class="icon--size-sm color--trivago-blue">fiber_manual_record</md-icon>
          <md-icon v-else class="icon--size-sm color--not-assigned">fiber_manual_record</md-icon>Target group:
        </small>
        <div class="card__content" v-if="targetGroups">
          <md-chip class="margin--5-2" v-for="targetGroup in targetGroups" :key="targetGroup">{{ targetGroup }}</md-chip>
        </div>
        <p class="card__content" v-else>Not assigned</p>
      </md-card>
      <md-card class="card--white flex--weight-2">
        <small>
          <md-icon v-if="mentorIds" class="icon--size-sm color--trivago-orange">fiber_manual_record</md-icon>
          <md-icon v-else class="icon--size-sm color--not-assigned">fiber_manual_record</md-icon>Mentor:
        </small>
        <div class="card__content" v-if="mentorIds">
          <div class="card--shadow flex-direction--row" v-for="mentor in mentors" :key="mentor.EmpNum">
            <div class="card--shadow__content flex--weight-8">
              <h1 class="card--shadow__title">{{ mentor.Name }}</h1>
              <span class="card--shadow__description">{{ mentor.Expertise }}</span><br/>
              <span class="card--shadow__description">{{ mentor.Email }}</span>
            </div>
            <div class="card--shadow__image flex--weight-1"><md-icon class="md-size-2x">person</md-icon></div>
          </div>
        </div>
        <p class="card__content" v-else>Not assigned</p>
      </md-card>
      <md-card class="card--white flex--weight-2">
        <small>
          <md-icon v-if="universityIds" class="icon--size-sm color--trivago-red">fiber_manual_record</md-icon>
          <md-icon v-else class="icon--size-sm color--not-assigned">fiber_manual_record</md-icon>University:
        </small>
        <div class="card__content" v-if="universityIds">
          <div class="card--shadow" v-for="university in universities" :key="university.UniCode">
            <div class="card--shadow__content card--shadow__content--image-bg" v-if="university.Logo"
                 :style="{ backgroundImage: 'url(' + university.Logo[0].thumbnails.large.url + ')'}">
              <h1 class="card--shadow__title">{{ university.Name }}</h1>
              <span class="card--shadow__description">{{ university.Address }}</span><br/>
              <span class="card--shadow__description">{{ university.Email }}</span>
            </div>
            <div class="card--shadow__content" v-else>
              <h1 class="card--shadow__title">{{ university.Name }}</h1>
              <span class="card--shadow__description">{{ university.Address }}</span><br/>
              <span class="card--shadow__description">{{ university.Email }}</span>
            </div>
          </div>
        </div>
        <p class="card__content" v-else>Not assigned</p>
      </md-card>
    </div>
  </div>
</div>
</template>

<script>
import VueAirtableService from './airtable-api/VueAirtableService'
export default {
  name: 'ProjectDetailPage',
  data () {
    return {
      recordId: null,
      projectTitle: '',
      targetGroups: [],
      mentors: [],
      mentorIds: [],
      universities: [],
      universityIds: [],
      projectDescription: '',
      startDate: '',
      endDate: '',
      attachments: []
    }
  },
  mounted: function () {
    this.recordId = this.$route.params.recordId
    this.getData(this.recordId)
  },
  methods: {
    async getData (recordId) {
      var response = await VueAirtableService.getRecord('Project', recordId)
      if (response.status === 200) {
        this.projectTitle = response.data.fields.Name
        this.targetGroups = response.data.fields['TargetGroups']
        this.mentorIds = response.data.fields['mentorTable']
        this.universityIds = response.data.fields['uniTable']
        this.projectDescription = response.data.fields['Project Description']
        this.startDate = response.data.fields['startDate']
        this.endDate = response.data.fields['endDate']
        this.attachments = response.data.fields['Attachment']
        if (this.mentorIds) {
          this.getTables('Mentor', this.mentorIds, this.mentors)
        }
        if (this.universityIds) {
          this.getTables('University', this.universityIds, this.universities)
        }
      }
    },
    async getTables (tableName, idArray, dataArray) {
      for (let i = 0; i < idArray.length; i++) {
        let response = await VueAirtableService.getRecord(tableName, idArray[i])
        if (response.status === 200) {
          dataArray.push(response.data.fields)
        }
      }
    },
    onDelete: function (id) {
      if (confirm('Do you really want to delete?')) {
        VueAirtableService.deleteRecord('Project', id).then((res) => {
          alert('The record is deleted.')
          this.$router.push({name: 'ProjectListView'})
        }).catch(error => {
          alert('Error: ' + error)
          console.log('Error in onDelete: ' + error)
          this.$router.push({name: 'ProjectListView'})
        })
      }
    }
  }
}
</script>

<style scoped>
  .detail-container {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    padding: 3em 10% 3em 10%;
    background-color: #f3f3f3;
  }
  .detail__project__title {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    text-align: start;
    padding: .5em 0;
  }
  .button-group {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .card--shadow {
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #f3f3f3;
    -webkit-box-shadow: 0px 3px 0px 0px rgba(226, 228, 231, 0.75);
    -moz-box-shadow:    0px 3px 0px 0px rgba(226, 228, 231, 0.75);
    box-shadow:         0px 3px 0px 0px rgba(226, 228, 231, 0.75);
    margin: .3em 0;
  }
  .card--shadow__image {
    padding: 10px;
    color: #fff;
    border-radius: 0 5px 5px 0;
    text-align: center;
    white-space: pre-line;
    display: flex;
    justify-content: center;
  }
  .card--shadow__content {
    padding: 10px;
    color: #747575;
    white-space: pre-line;
  }
  .card--shadow__content--image-bg {
    background-color: #ffffffcd;
    padding: 10px;
    white-space: pre-line;
    background-size: auto 3em;
    display: block;
    background-repeat: no-repeat;
    background-position: bottom right;
    background-blend-mode: screen;
    background-origin: content-box;
  }
  .card--shadow__title {
    font-size: 1.2em;
    font-weight: 500;
    text-transform: uppercase;
    color: #444545;
    white-space: pre-line;
    padding: 0;
    margin: 0 0 .3em 0;
  }
  .card--shadow__description {
    font-size: 1em;
    line-height: .8em;
    text-align: start;
    white-space: pre-line;
  }
</style>
