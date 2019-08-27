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
        <div class="project__details__content" v-if="attachments !== undefined"
             v-for="attachment in attachments" :key="attachment.id">
          <md-button class="md-icon-button" v-if="attachment.type === 'application/pdf'">
            <a v-bind:href="attachment.url" target="_blank"><md-icon class="md-dark">picture_as_pdf</md-icon></a>
            <md-tooltip md-direction="bottom">{{ attachment.filename }}</md-tooltip>
          </md-button>
          <md-button v-else>

          </md-button>
        </div>
        <div class="project__details__content" v-else>No Attachment</div>
      </md-card>
    </div>
    <div class="flex-direction--column">
      <md-card>
        <span class="project__details__title">Mentor:</span>
        <div class="project__details__content" v-if="mentors">
          <li v-for="mentor in mentors" :key="mentor">
            {{ mentor }}
          </li>
        </div>
        <p class="project__details__content" v-else>Not assigned</p>
      </md-card>

      <md-card>
        <span class="project__details__title">University:</span>
        <div class="project__details__content" v-if="universities">
          <li v-for="university in universities" :key="university">
            {{ university }}
          </li>
        </div>
        <p class="project__details__content" v-else>Not assigned</p>
      </md-card>

      <md-card>
        <span class="project__details__title">Target Group:</span>
        <div class="project__details__content" v-if="targetGroups">
          <li v-for="targetGroup in targetGroups" :key="targetGroup">
            {{ targetGroup }}
          </li>
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
      universities: [],
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
      console.log('record Id : ' + recordId)
      var response = await VueAirtableService.getRecord('Project', recordId)
      if (response.status === 200) {
        this.projectTitle = response.data.fields.Name
        this.targetGroups = response.data.fields['TargetGroups']
        this.mentors = response.data.fields['Mentors']
        this.universities = response.data.fields['Universities']
        this.projectDescription = response.data.fields['Project Description']
        this.startDate = response.data.fields['startDate']
        this.endDate = response.data.fields['endDate']
        this.attachments = response.data.fields['Attachment']
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
