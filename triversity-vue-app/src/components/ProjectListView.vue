<template>
  <div>
    <div class="search-bar--container">
      <div class="horizontal--layout">
        <SearchBar @messageFromSearchBar="childMessageReceived" id="searchBar"></SearchBar>
        <CreateButton id="createBtn"></CreateButton>
      </div>
    </div>
    <div class="filter-container">
<!--      comp. &ndash;&gt; filtering with input-text(not drop-down) that user entered and call api with the query and this will be shown as a chip(tag-chip)-->
      <b-card bg-variant="light">
        <div>
          <b-form-group label-row-sm="2"
                        label="Status"
                        label-size="sm"
                        label-class="pt-0">
            <b-form-group id="fgStatusUniv"
                          label="University"
                          label-size="sm"
                          label-cols="2"
                          label-align="right"
                          label-for="filterStatusUniversity"
                          class="filter-label">
              <b-form-select v-model="filterStatusUniversity"
                             :options="filterStatusOptions"
                             size="sm"
                             id="filterStatusUniversity"
                             class="mt-0" @change="filterStatus"></b-form-select>
            </b-form-group>
            <b-form-group id="fgStatusMentor"
                          label="Mentor"
                          label-size="sm"
                          label-cols="2"
                          label-align="right"
                          label-for="filterStatusMentor"
                          class="filter-label">
              <b-form-select v-model="filterStatusMentor"
                             :options="filterStatusOptions"
                             size="sm"
                             id="filterStatusMentor"
                             class="mt-3" @change="filterStatus"></b-form-select>
            </b-form-group>
          </b-form-group>
        </div>
        <div>
          <b-form-group label-row-sm="2"
                        label="Target Group"
                        label-size="sm"
                        label-class="pt-0">
            <b-form-select v-model="filterTargetGroup"
                           :options="filterTargetGroupOptions"
                           size="sm"
                           id="filterTargetGroup"
                           class="mt-0"></b-form-select>
          </b-form-group>
        </div>
      </b-card>
    </div>
    <div class="list-container">
      <md-list :md-expand-single="expandSingle">
        <md-list-item class="list--header">
          <span class="md-list-item-text md-title">Projects</span>
        </md-list-item>
        <div v-for="record in showingRecords" :key="record.id">
          <md-list-item md-expand :md-expanded.sync="record._showDetails">
            <span class="md-list-item-text">{{ record.fields['Name'] }}</span>
            <div slot="md-expand" class="project__details flex-direction--column">
              <div class="flex-direction--row">
                <div>
                  <md-card>
                    <span class="project__details__title">Project Description:</span>
                    <p class="project__details__content">{{ record.fields['Project Description'] }}</p>
                  </md-card>
                </div>
                <div class="flex-direction--column">
                    <md-card>
                      <span class="project__details__title">University:</span>
                      <p class="project__details__content" v-if="record.fields['University']">{{ record.fields['University'] }}</p>
                      <p class="project__details__content" v-else>open</p>
                    </md-card>
                    <md-card>
                      <span class="project__details__title">Mentor:</span>
                      <p class="project__details__content" v-if="record.fields['Mentor']">{{ record.fields['Mentor'] }}</p>
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
                <b-button variant="link" class="text-decoration-none"><md-icon>delete</md-icon></b-button>
                <b-button variant="link" class="text-decoration-none"><md-icon>edit</md-icon></b-button>
              </div>
            </div>
          </md-list-item>
        </div>
      </md-list>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import CreateButton from './CreateButton'
import SearchBar from './SearchBar'

export default {
  name: 'ProjectListView',
  props: [
    'base'
  ],
  components: {
    SearchBar,
    CreateButton
  },
  data: function () {
    return {
      apiUrl: 'https://api.airtable.com/v0/',
      apiKey: 'keyVzJe5qGOll341v', // Always use a read-only account token
      records: [],
      showingRecords: [],
      expandProject: false,
      expandSingle: true,
      // variables for filter
      filterStatusUniversity: null,
      filterStatusMentor: null,
      filterStatusOptions: [
        { value: null, text: 'all' },
        { value: 'assigned', text: 'assigned' },
        { value: 'open', text: 'not assigned' }
      ],
      filterTargetGroup: null,
      filterTargetGroupOptions: [
        { value: null, text: 'all' },
        { value: 'Tech', text: 'Tech' },
        { value: 'Marketing', text: 'Marketing' },
        { value: 'Finance', text: 'Finance' },
        { value: 'Data Engineering', text: 'Data Engineering' }
      ]
    }
  },
  mounted: function () {
    if (!this.base) {
      return console.error('Please specify `base` and `columns` attributes for <vue-airtable> component.')
    }
    this.getData()
  },
  watch: {
    table: function (newTable, oldTable) {
      this.getData()
    }
  },
  methods: {
    getData: function () {
      // ref: vue kitchensink project
      // vueairtable as a component and getData -> vueairtable
      axios({
        url: this.apiUrl + this.base + '/Project',
        headers: {
          'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
        }
      }).then((res) => {
        this.records = res.data.records
        this.showingRecords = this.records
        console.log(this.records)
      })
    },
    childMessageReceived: function (componentName, arg) {
      switch (componentName) {
        case 'SearchBar':
          this.searchAllRecordsWithInput(arg)
          break
      }
    },
    searchAllRecordsWithInput: function (searchText) {
      if (this.records == null) {
        this.showingRecords = []
      } else {
        this.records.forEach((record) => {
          // search
        })
      }
    },
    filterStatus: function () {
      // call
      // using tags
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1%;
    justify-content: space-between;
  }
  #searchBar {
    width: 30%;
    margin-right: 3%;
  }
  /** Filter CSS **/
  .filter-container {
    box-sizing: border-box;
    background-color: #EBECED;
    width: 100%;
    height: fit-content;
    line-height: 50px;
    vertical-align: bottom;
    padding: .5em 10%;
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
    max-width: 100%;
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
  .flex-direction--row > div:nth-child(1) {
    flex: 2;
  }
  .flex-direction--row > div,
  .flex-direction--column > .md-card,
  .card-body > div {
    flex: 1;
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
</style>
