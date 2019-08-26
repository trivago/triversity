<template>
  <div class="listview-content">
    <div class="search-bar--container">
      <div class="horizontal--layout">
        <SearchBar @messageFromSearchBar="childMessageReceived" id="searchBar"></SearchBar>
        <b-button @click="$router.push('AddProjectPage')" id="createButton">Create</b-button>
      </div>
    </div>
    <div class="filter-container">
      <div class="md-layout md-gutter">
        <FilterAutocomplete @messageFromFilterAutocomplete="childMessageReceived"
                            :field="'Target Group'"
                            :options="filterTargetGroupOptions"/>
        <FilterAutocomplete @messageFromFilterAutocomplete="childMessageReceived"
                            :field="'University'"
                            :options="filterUniversityOptions"/>
        <FilterAutocomplete @messageFromFilterAutocomplete="childMessageReceived"
                            :field="'Mentor'"
                            :options="filterMentorOptions"/>
      </div>
      <div>
        <md-chips md-static md-check-duplicated class="md-primary shake-on-error">
          <md-chip v-for="filter in filters" :key="filter"
                   md-deletable
                   @md-delete="deleteFilter(filter)">{{ filter }}</md-chip>
        </md-chips>
      </div>
    </div>
    <Loading v-if="isLoading" />
    <div v-else class="list-container">
      <NoResultsFound v-if="records.length === 0"></NoResultsFound>
      <md-list v-else :md-expand-single="expandSingle">
        <md-list-item class="list--header">
          <span class="md-list-item-text md-title">Projects</span>
        </md-list-item>
        <div v-for="record in records" :key="record.id">
          <md-list-item md-expand :md-expanded.sync="record._showDetails">
            <span class="md-list-item-text">{{ record.fields['Name'] }}</span>
            <div slot="md-expand" class="project__details flex-direction--column">
              <div class="flex-direction--row">
                <div class="project__detail__project-description">
                  <md-card>
                    <span class="project__details__title">Project Description:</span>
                    <p class="project__details__content">{{ record.fields['Project Description'] }}</p>
                  </md-card>
                </div>
                <div class="flex-direction--column">
                    <md-card>
                      <span class="project__details__title">University:</span>
                      <p class="project__details__content" v-if="record.fields['Universities']">
                        {{ record.fields['Universities'].join(', ') }}
                      </p>
                      <p class="project__details__content" v-else>open</p>
                    </md-card>
                    <md-card>
                      <span class="project__details__title">Mentor:</span>
                      <p class="project__details__content" v-if="record.fields['Mentors']">
                        {{ record.fields['Mentors'].join(', ') }}
                      </p>
                      <p class="project__details__content" v-else>open</p>
                    </md-card>
                  </div>
                <div class="flex-direction--column" v-show="record.fields['Attachment']">
                    <md-card>
                      <span class="project__details__title">Attachment:</span>
                      <div class="project__details__content"
                           v-for="file in record.fields['Attachment']" :key="file.id">
                        <md-button class="md-icon-button" v-if="file.type === 'application/pdf'">
                          <a v-bind:href="file.url" target="_blank"><md-icon class="md-dark">picture_as_pdf</md-icon></a>
                        </md-button>
                      </div>
                    </md-card>
                  </div>
              </div>
              <div class="button-group">
                <b-button variant="link" class="text-decoration-none" @click="onDelete (record.id)"><md-icon>delete</md-icon></b-button>
                    <b-button variant="link" class="text-decoration-none" @click="$router.push({ name: 'EditProjectPage', params: { recordId: record.id} })"><md-icon>edit</md-icon></b-button>
              </div>
            </div>
          </md-list-item>
        </div>
      </md-list>
    </div>
  </div>
</template>

<script>
import VueAirtableService from './airtable-api/VueAirtableService'
import SearchBar from './SearchBar'
import Loading from './Loading'
import NoResultsFound from './NoResultsFound'
import FilterAutocomplete from './FilterAutocomplete'

export default {
  name: 'ProjectListView',
  props: [
    'base'
  ],
  components: {
    FilterAutocomplete,
    NoResultsFound,
    Loading,
    SearchBar
  },
  data: function () {
    return {
      apiUrl: 'https://api.airtable.com/v0/',
      apiKey: process.env.AIRTABLE_API_KEY,
      // apiKey: 'keyVzJe5qGOll341v', // Always use a read-only account token
      records: [],
      expandSingle: true,
      isLoading: false,
      // variables for filter
      filterTextTargetGroup: '',
      filterTextUniversity: '',
      filterTextMentor: '',
      filters: [],
      filterQueries: [],
      filterTargetGroupOptions: [],
      filterUniversityOptions: [],
      filterMentorOptions: [],
      sort: ''
    }
  },
  mounted: function () {
    if (!this.base) {
      return console.error('Please specify `base` and `columns` attributes for <vue-airtable> component.')
    }
    this.getData()
    this.getTargetGroup()
    this.getUniversities()
    this.getMentors()
  },
  watch: {
    filters: function () {
      this.getData()
    }
  },
  methods: {
    async getData () {
      var joinQueryForAllFilters = ''
      if (this.filters.length > 0) {
        joinQueryForAllFilters = 'OR(' + this.filterQueries.join() + ')'
      }
      this.isLoading = true
      var response = await VueAirtableService.getRecords('Project', joinQueryForAllFilters, this.sort)
      this.records = response.data.records
      this.isLoading = false
      console.log(response)
    },
    childMessageReceived: function (title, arg) {
      console.log(title, arg)
      switch (title) {
        case 'SearchBar':
          this.searchAllRecordsWithInput(arg)
          break
        case 'Target Group':
        case 'University':
        case 'Mentor':
          this.addFilter(title, arg)
          break
      }
    },
    async searchAllRecordsWithInput (searchText) {
      var query = 'OR(' +
        'FIND(LOWER(\'' + searchText + '\'), LOWER({Name})),' +
        'FIND(LOWER(\'' + searchText + '\'), LOWER({Target Group})),' +
        'FIND(LOWER(\'' + searchText + '\'), LOWER({Mentor})),' +
        'FIND(LOWER(\'' + searchText + '\'), LOWER({University})),' +
        'FIND(LOWER(\'' + searchText + '\'), LOWER({Project Description}))' +
        ')'
      this.isLoading = true
      var response = await VueAirtableService.getRecords('Project', query)
      this.records = response.data.records
      this.isLoading = false
    },
    async getTargetGroup () {
      var response = await VueAirtableService.getRecords('TargetGroup')
      response.data.records.forEach((record) => {
        this.filterTargetGroupOptions.push(record.fields['Name'])
      })
    },
    async getUniversities () {
      var response = await VueAirtableService.getRecords('University')
      response.data.records.forEach((record) => {
        this.filterUniversityOptions.push(record.fields['Name'])
      })
    },
    async getMentors () {
      var response = await VueAirtableService.getRecords('Mentor')
      response.data.records.forEach((record) => {
        this.filterMentorOptions.push(record.fields['Name'])
      })
    },
    addFilter: function (field, value) {
      if (this.filters.indexOf(value) > -1) {
        // selected filter is already in filters array
        var mdChips = document.getElementsByClassName('md-chip')
        Array.from(mdChips).forEach((chip) => {
          if (chip.innerText === value) {
            chip.classList.add('md-duplicated')
          }
        })
      } else {
        this.filters.push(value)
        var query = 'FIND(\'' + value + '\', {' + field + '})'
        this.filterQueries.push(query)
      }
    },
    deleteFilter: function (filter) {
      var index = this.filters.indexOf(filter)
      if (index > -1) {
        this.filters.splice(index, 1)
      }
    },
    onDelete: function (id) {
      if (confirm('Do you really want to delete?')) {
        VueAirtableService.deleteRecord('Project', id).then((res) => {
          alert('The record is deleted.')
          this.getData()
        }).catch(error => {
          alert('Error: ' + error)
          console.log('Error in onDelete: ' + error)
        })
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .listview-content {
    background-color: #f3f3f3;
  }
  .search-bar--container {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    background-color: #EBECED;
    padding-top: .5em;
    padding-left: 10%;
    padding-right: 10%;
  }
  .horizontal--layout {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: auto;
    margin-bottom: 1%;
    justify-content: space-between;
  }
  .input-group {
    width: 50% !important;
  }
  #createButton {
    align-self: flex-start;
  }
  #searchBar {
    width: 50%;
    margin-right: 3%;
  }
  /** Filter CSS **/
  .filter-container {
    box-sizing: border-box;
    background-color: #EBECED;
    width: 100%;
    height: fit-content;
    padding: 0 10% .5em 10%;
  }
  .filter--box {
    box-sizing: border-box;
    padding: .5em 0 .5em .5em;
    text-align: start;
    font-size: 1rem;
  }
  .form-group {
    padding: 0;
    margin: 0;
    text-align: start;
  }
  .filter-label {
    padding: .2rem;
    line-height: 1;
  }

  /** List CSS **/
  .list-container {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    padding: 0 10% 3em 10%;
  }
  .list-container > .md-list {
    box-sizing: border-box;
    width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid #00000012;
    background-color: white;
  }
  .list--header {
    border-bottom: 1px solid #EBECED;
  }
  .project__details {
    box-sizing: border-box;
    width: inherit;
    height: fit-content;
    padding: .8em;
    justify-content: space-between;
    background-color: #EBECED;
  }
  .flex-direction--row {
    display: flex;
    flex-direction: row;
  }
  .flex-direction--column,
  .card-body {
    display: flex;
    flex-direction: column;
  }
  .flex-direction--row > div,
  .flex-direction--column > .md-card,
  .card-body > div,
  .flex-direction--row > .project__detail__project-description {
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
  .button-group {
    width: 100%;
    background-color: white;
    border: 1px solid #E1E1E1;
  }
  .button-group > button {
    display: inline;
    float: right;
    color: #616161;
  }
  a, a:visited, a:focus, a:hover {
    color: #616161;
    text-decoration: none;
  }
  .shake-on-error /deep/ .md-duplicated {
    animation-name: shake;
    animation-duration: 0.5s;
  }
  @keyframes shake {
    0% { transform: translate(15px); }
    20% { transform: translate(-15px); }
    40% { transform: translate(7px); }
    60% { transform: translate(-7px); }
    80% { transform: translate(3px); }
    100% { transform: translate(0px); }
  }
</style>
