<template>
<div class="detail-container">
  <div class="detail__project__title">
    <small>Project Title: </small><br/>
    <h2><strong>{{ projectTitle }}</strong></h2>
  </div>
  <div class="flex-direction--row">
    <div class="flex-direction--column flex--weight-2">
      <md-card class="card--white flex--weight-8">
        <small>Project Description:</small>
        <p class="card__content">{{ projectDescription }}</p>
      </md-card>
      <md-card class="card--white flex--weight-1">
        <small>Attachment:</small>
        <div class="card__content" v-if="attachments !== undefined">
          <a v-for="file in attachments" :key="file.id" v-bind:href="file.url">
            <md-chip class="margin--5-2" md-clickable md-click="" >{{ file.filename }}</md-chip>
          </a>
        </div>
        <div class="card__content" v-else>No Attachment</div>
      </md-card>
    </div>
    <div class="flex-direction--column flex--weight-1">
      <md-card class="card--white flex--weight-1">
        <small>Target Group:</small>
        <div class="card__content" v-if="targetGroups">
          <md-chip class="margin--5-2" v-for="targetGroup in targetGroups" :key="targetGroup">{{ targetGroup }}</md-chip>
        </div>
        <p class="card__content" v-else>Not assigned</p>
      </md-card>
      <md-card class="card--white flex--weight-1">
        <small>Mentor:</small>
        <div class="card__content" v-if="mentors">
          <div v-for="mentor in mentors" :key="mentor.EmpNum">
            <b-card :title="mentor.Name" :sub-title="mentor.Expertise">
              <b-card-text>
                {{mentor.Email}}
              </b-card-text>
            </b-card>
          </div>
        </div>
        <p class="card__content" v-else>Not assigned</p>
      </md-card>
      <md-card class="card--white flex--weight-1">
        <small>University:</small>
        <div class="card__content" v-if="universities">
          <div v-for="university in universities" :key="university.UniCode">
            <b-card :title="university.Name" :sub-title="university.Address">
              <b-card-text>
                {{university.Email}}
              </b-card-text>
            </b-card>
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
        this.getTables('Mentor', this.mentorIds, this.mentors)
        this.getTables('University', this.universityIds, this.universities)
        console.log(this.attachments)
      }
    },
    async getTables (tableName, idArray, dataArray) {
      for (let i = 0; i < idArray.length; i++) {
        let response = await VueAirtableService.getRecord(tableName, idArray[i])
        if (response.status === 200) {
          dataArray.push(response.data.fields)
        }
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
</style>
