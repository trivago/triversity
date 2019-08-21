<template>
  <div class="card-expansion">
    <md-card v-for="record in records" :key="record.id">
      <md-card-expand>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{ record.fields['Name'] }}</div>
          </md-card-header-text>
          <div class="project__university-info">
            {{ record.fields['University'] }}
          </div>
          <div>
            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </div>
        </md-card-header>
      </md-card-expand>
      <md-card-expand-content>
        <md-card-content>
          <div>
            Project description:<br>
            {{ record.fields['Project Description'] }}
          </div>
          <div class="project__attachment" v-show="record.fields['Attachment']" v-for="file in record.fields['Attachment']" :key="file.id">
            <md-button class="md-icon-button" :href="file.url" v-if="file.type === 'application/pdf'">
              <md-icon>picture_as_pdf</md-icon>
            </md-button>
          </div>
        </md-card-content>
      </md-card-expand-content>
    </md-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProjectListView',
  props: [
    'base'
  ],
  data: function () {
    return {
      apiUrl: 'https://api.airtable.com/v0/',
      apiKey: 'keyVzJe5qGOll341v', // Always use a read-only account token
      records: []
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
      axios({
        url: this.apiUrl + this.base + '/Project',
        headers: {
          'Authorization': 'Bearer ' + this.apiKey
        }
      }).then((res) => {
        this.records = res.data.records
        console.log(this.records)
      })
    }
    // checkData: function () {
    //   axios({
    //     url: 'https://api.airtable.com/v0/appkmRgOBmQGWlfoc/University/recB3brMaACVDXbcL',
    //     headers: {
    //       'Authorization': 'Bearer ' + this.apiKey
    //     }
    //   }).then((res) => {
    //     console.log(res.data.fields.Name)
    //   })
    // }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-expansion {
    height: fit-content;
  }
  .md-card {
    width: 80%;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .md-card-header {
    height: inherit;
    line-height: inherit;
    vertical-align: bottom;
  }
  .md-card-header-text,
  .md-card-content{
    text-align: start;
  }
  .project__university-info {
    height: fit-content;
    vertical-align: bottom;
  }
  a, a:visited, a:focus, a:hover {
    color: #212121;
    text-decoration: none;
  }
</style>
