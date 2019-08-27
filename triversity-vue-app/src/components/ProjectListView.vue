<template>
  <div class="listview-content">
    <div class="search-bar--container">
      <div class="horizontal--layout">
        <SearchBar @messageFromSearchBar="childMessageReceived" id="searchBar"></SearchBar>
        <b-button @click="$router.push('AddProjectPage')" id="createButton">Create</b-button>
      </div>
    </div>
    <b-container fluid class="filter-container">
      <b-row>
        <b-col class="text-sm-left"><small><strong>Filters:</strong></small></b-col>
        <div class="w-100"></div>
        <b-col>
          <FilterMultiselect @messageFromFilterMultiselect="childMessageReceived"
                             :field="'tgTable'"
                             :options="filterTargetGroupOptions"
                             :multiple="true" :taggable="true" ref="filterMultiSelect"/>
        </b-col>
        <b-col>
          <FilterMultiselect @messageFromFilterMultiselect="childMessageReceived"
                             :field="'uniTable'"
                             :options="filterUniversityOptions"
                             :multiple="true" :taggable="true" ref="filterMultiSelect"/>
        </b-col>
        <b-col>
          <FilterMultiselect @messageFromFilterMultiselect="childMessageReceived"
                             :field="'mentorTable'"
                             :options="filterMentorOptions"
                             :multiple="true" :taggable="true" ref="filterMultiSelect"/>
        </b-col>
<!--        <div class="w-100"></div>-->
<!--        <b-col class="text-sm-right" style="padding-top: .5em">-->
<!--          <md-button class="md-button-clean" @click="resetFilters">-->
<!--            <small>Clear filters</small><md-icon class="md-dark" md-size="1em">clear</md-icon>-->
<!--            <md-tooltip md-direction="bottom">Remove all selected filters</md-tooltip>-->
<!--          </md-button>-->
<!--        </b-col>-->
      </b-row>
    </b-container>
    <Loading v-if="isLoading" />
    <div v-else class="list-container">
      <NoResultsFound v-if="records.length === 0"></NoResultsFound>
      <md-list v-else :md-expand-single="expandSingle">
        <md-list-item class="list--header">
          <ListItem :header=true
                    :title="'Project'"
                    :date="{'start': 'Start date', 'end': 'End date'}"
                    :sort="sort"
                    @messageFromListItem="childMessageReceived"/>
        </md-list-item>
        <div v-for="record in records" :key="record.id">
          <md-list-item md-expand :md-expanded.sync="record._showDetails">
            <ListItem :header=false
                      :title="record.fields['Name']"
                      :date="{'start': record.fields['startDate'], 'end': record.fields['endDate']}"/>
            <div slot="md-expand" class="project__details flex-direction--column">
              <div class="flex-direction--row">
                <div class="flex-direction--column project__detail__project-description">
                  <md-card>
                    <span class="project__details__title">Project Description:</span>
                    <p class="project__details__content" style="white-space: pre-wrap">{{ record.fields['Project Description'] }}</p>
                  </md-card>
                  <md-card v-show="record.fields['Attachment']">
                    <div class="project__details__content"
                         v-for="file in record.fields['Attachment']" :key="file.id">
                      <md-button class="md-icon-button" v-if="file.type === 'application/pdf'">
                        <a v-bind:href="file.url" target="_blank"><md-icon class="md-dark">picture_as_pdf</md-icon></a>
                        <md-tooltip md-direction="bottom">{{ file.filename }}</md-tooltip>
                      </md-button>
                    </div>
                  </md-card>
                </div>
                <div class="flex-direction--column">
                  <md-card>
                    <span class="project__details__title">Target group:</span>
                    <div class="project__details__content" v-if="record.fields['TargetGroups']">
                      <li v-for="targetGroup in record.fields['TargetGroups']" :key="targetGroup">
                        {{ targetGroup }}
                      </li>
                    </div>
                    <li class="project__details__content" v-else>Not assigned</li>
                  </md-card>
                  <md-card>
                    <span class="project__details__title">University:</span>
                    <div class="project__details__content" v-if="record.fields['Universities']">
                      <li v-for="university in record.fields['Universities']" :key="university">
                        {{ university }}
                      </li>
                    </div>
                      <li class="project__details__content" v-else>Not assigned</li>
                  </md-card>
                  <md-card>
                    <span class="project__details__title">Mentor:</span>
                    <div class="project__details__content" v-if="record.fields['Mentors']">
                      <li v-for="mentor in record.fields['Mentors']" :key="mentor">
                        {{ mentor }}
                      </li>
                    </div>
                    <li class="project__details__content" v-else>Not assigned</li>
                  </md-card>
                </div>
              </div>
              <div class="button-group">
                <b-button variant="link" class="text-decoration-none" @click="onDelete (record.id)"><md-icon>delete</md-icon></b-button>
                <b-button variant="link" class="text-decoration-none" @click="$router.push({ name: 'EditProjectPage', params: { recordId: record.id} })"><md-icon>edit</md-icon></b-button>
                <b-button variant="link" class="text-decoration-none" @click="$router.push({ name: 'ProjectDetailPage', params: { recordId: record.id} })"><md-icon>visibility</md-icon></b-button>
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
import ListItem from './ListItem'
import FilterMultiselect from './FilterMultiselect'

export default {
  name: 'ProjectListView',
  props: [
    'base'
  ],
  components: {
    FilterMultiselect,
    ListItem,
    NoResultsFound,
    Loading,
    SearchBar
  },
  data: function () {
    return {
      apiUrl: 'https://api.airtable.com/v0/',
      apiKey: process.env.AIRTABLE_API_KEY,
      records: [],
      expandSingle: true,
      isLoading: false,
      searchTerms: '',
      // variables for filter
      filters: {},
      filterTargetGroupOptions: [],
      filterUniversityOptions: [],
      filterMentorOptions: [],
      sort: {
        field: 'startDate',
        direction: 'desc'
      }
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
  methods: {
    async getData () {
      var joinQueryForAllFilters = ''
      var arrayForQuery = []

      if (Object.keys(this.filters).length > 0) {
        // AND for selected filters
        arrayForQuery.push('AND(' + Object.values(this.filters).join() + ')')
      }
      if (this.searchTerms !== '') {
        arrayForQuery.push(this.searchTerms)
      }
      if (arrayForQuery.length > 0) {
        joinQueryForAllFilters = 'AND(' + arrayForQuery.join() + ')'
      }
      var sort = 'sort%5B0%5D%5Bfield%5D=' + this.sort.field + '&sort%5B0%5D%5Bdirection%5D=' + this.sort.direction
      this.isLoading = true
      var response = await VueAirtableService.getRecords('Project', joinQueryForAllFilters, sort)
      this.records = response.data.records
      this.isLoading = false
    },
    childMessageReceived: function (title, arg) {
      switch (title) {
        case 'SearchBar':
          this.searchAllRecordsWithInput(arg)
          break
        case 'tgTable':
        case 'uniTable':
        case 'mentorTable':
          if (arg === 'remove') {
            this.removeFilter(title)
          } else {
            this.addFilter(title, arg)
          }
          break
        case 'startDate':
        case 'endDate':
        case 'Name':
          this.sortList(title, arg)
          break
      }
    },
    async searchAllRecordsWithInput (searchText) {
      if (searchText !== '') {
        var query = `OR(
        FIND(LOWER('${searchText}'), LOWER(Name)),
        FIND(LOWER('${searchText}'), LOWER(tgTable)),
        FIND(LOWER('${searchText}'), LOWER(uniTable)),
        FIND(LOWER('${searchText}'), LOWER(mentorTable)),
        FIND(LOWER('${searchText}'), LOWER({Project Description}))
        )`
        this.searchTerms = query
      } else {
        this.searchTerms = ''
      }
      this.getData()
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
    addFilter: function (field, filter) {
      if (this.filters.length > 0 && this.filters.hasKey(field)) {
        this.filters[field] = filter
      } else {
        Object.assign(this.filters, { [field]: filter })
      }
      this.getData()
    },
    removeFilter: function (field) {
      delete this.filters[field]
      this.getData()
    },
    resetFilters: function () {
      this.$refs.filterMultiSelect.resetFilters()
      this.filters = {}
      this.getData()
    },
    sortList: function (field, direction) {
      this.sort = { field: field, direction: direction }
      this.getData()
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
    padding-top: 1em;
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
    padding: 0 10% 1em 10%;
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
    top: 0;
    position: sticky;
    z-index: 10;
    background-color: #ffffff;
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
  .card-body > div {
    flex: 1;
  }
  .flex-direction--row > .project__detail__project-description {
    flex: 2;
  }
  .flex-direction--column .project__detail__project-description > .md-card:first-child {
    flex: 8
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
  .md-button:active,
  .md-button:focus {
    outline: none;
  }
  .md-ripple {
    padding: 0;
    margin: 0
  }
</style>
