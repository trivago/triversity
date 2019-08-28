<template>
  <div class="listview-content">
    <div class="search-bar--container">
      <div class="flex-direction--row">
        <div class="flex--weight-8">
          <SearchBar class="width-50" id="searchBar" @messageFromSearchBar="childMessageReceived"></SearchBar>
        </div>
        <b-button @click="$router.push('AddProjectPage')">Create</b-button>
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
            <div slot="md-expand">
              <ProjectListExpandPreview :record = "record"
                              @messageFromProjectPreview="childMessageReceived"></ProjectListExpandPreview>
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
import ProjectListExpandPreview from './ProjectListExpandPreview'

export default {
  name: 'ProjectListView',
  props: [
    'base'
  ],
  components: {
    ProjectListExpandPreview,
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
    checkTextOverflowForDescription: function (text) {
      if (text === undefined || text.length === 0) return

      if (text.length > 300) {
        return text.substring(0, 299) + '...'
      }
      return text
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
        case 'deleteRecord':
          this.onDelete(arg)
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
    box-sizing: border-box;
    background-color: #f3f3f3;
  }
  .search-bar--container {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    background-color: #EBECED;
    padding: 1em 10% .5em 10%;
  }
  #searchBar {
    margin-right: 1em;
  }
  .filter-container {
    box-sizing: border-box;
    background-color: #EBECED;
    width: 100%;
    height: fit-content;
    padding: 0 10% 1em 10%;
  }
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
</style>
