<template>
<div class="project-detail-container">
  <div class="project__detail__project-title">
    <md-card>
      <span class="project__details__title">Project Title:</span>
      <p><strong>{{ projectTitle }}</strong></p>
    </md-card>
  </div>

  <div class="project__details flex-direction--row">
    <div class="flex-direction--column project__detail__project-description">
      <md-card>
        <span class="project__details__title">Project Description:</span>
        <p class="project__details__content" style="white-space: pre-wrap">{{ projectDescription }}</p>
      </md-card>

      <md-card>
        <span class="project__details__title">Attachment:</span>
        <div class="project__details__content" v-if="attachments !== undefined">
          <md-chip v-for="file in attachments" :key="file.id">{{ file.filename }}</md-chip>
        </div>
        <div class="project__details__content" v-else>No Attachment</div>
      </md-card>
    </div>
    <div class="flex-direction--column">
      <md-card>
        <span class="project__details__title">Target Group:</span>
        <div class="project__details__content" v-if="targetGroups">
          <md-chip v-for="targetGroup in targetGroups" :key="targetGroup">{{ targetGroup }}</md-chip>
        </div>
        <p class="project__details__content" v-else>Not assigned</p>
      </md-card>

      <md-card>
        <span class="project__details__title">Mentor:</span>
        <div class="project__details__content" v-if="mentors">
          <div v-for="mentor in mentors" :key="mentor.EmpNum">
            <b-card :title="mentor.Name" :sub-title="mentor.Expertise">
              <b-card-text>
                {{mentor.Email}}
              </b-card-text>
            </b-card>
          </div>
        </div>
        <p class="project__details__content" v-else>Not assigned</p>
      </md-card>

      <md-card>
        <span class="project__details__title">University:</span>
        <div class="project__details__content" v-if="universities">
          <div v-for="university in universities" :key="university.UniCode">
            <b-card :title="university.Name" :sub-title="university.Address">
              <b-card-text>
                {{university.Email}}
              </b-card-text>
            </b-card>
          </div>
        </div>
        <p class="project__details__content" v-else>Not assigned</p>
      </md-card>

    </div>
  </div>
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
        this.getMentors()
        this.getUniversities()
        console.log(this.attachments)
      }
    },
    async getMentors () {
      for (let i = 0; i < this.mentorIds.length; i++) {
        var response = await VueAirtableService.getRecord('Mentor', this.mentorIds[i])
        if (response.status === 200) {
          this.mentors.push(response.data.fields)
        }
      }
    },
    async getUniversities () {
      for (let i = 0; i < this.universityIds.length; i++) {
        var response = await VueAirtableService.getRecord('University', this.universityIds[i])
        if (response.status === 200) {
          this.universities.push(response.data.fields)
        }
      }
    }
  }
}
</script>

<style scoped>
  .project-detail-container {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    padding: 3em 10% 3em 10%;
    background-color: #f3f3f3;
  }
  .flex-direction--row {
    display: flex;
    flex-direction: row;
  }
  .flex-direction--column {
    display: flex;
    flex-direction: column;
  }
  .flex-direction--row > div,
  .flex-direction--column > .md-card {
    flex: 1;
  }
  .flex-direction--row > div.project__detail__project-description {
    flex: 2;
  }
  .md-card {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    box-shadow: none;
    background-color: white;
    border: 1px solid #00000022;
    padding: .3rem .5rem;
    text-align: start;
  }
  .project__details__title {
    box-sizing: border-box;
    display: inline-flex;
    font-size: .8rem;
    color: #5d5d5d;
    white-space: normal;
  }
  .project__details__content {
    box-sizing: border-box;
    font-size: .85rem;
    font-weight: 500;
    color: #212121;
    white-space: normal;
    padding: .2rem 0;
  }
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
