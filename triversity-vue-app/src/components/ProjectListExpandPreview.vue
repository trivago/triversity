<template>
  <div class="project__preview flex-direction--column">
    <div class="flex-direction--row">
      <div class="flex-direction--column flex--weight-2">
        <md-card class="card--white flex--weight-8">
          <small>Project Description:</small>
          <p class="card__content">{{ record.fields['Project Description'] }}</p>
        </md-card>
        <md-card class="card--white flex--weight-1" v-show="record.fields['Attachment']">
          <small>Attachment:</small>
          <a v-for="file in record.fields['Attachment']" :key="file.id" v-bind:href="file.url">
            <md-chip class="margin--5-2" md-clickable md-click="" >{{ file.filename }}</md-chip>
          </a>
        </md-card>
      </div>
      <div class="flex-direction--column flex--weight-1">
        <md-card class="card--white flex--weight-1">
          <small>Target group:</small>
          <div class="card__content" v-if="record.fields['TargetGroups']">
            <md-chip class="margin--5-2" v-for="targetGroup in record.fields['TargetGroups']" :key="targetGroup">{{ targetGroup }}</md-chip>
          </div>
          <span class="card__content" v-else>Not assigned</span>
        </md-card>
        <md-card class="card--white flex--weight-1">
          <small>University:</small>
          <div class="card__content" v-if="record.fields['Universities']">
            <md-chip class="margin--5-2" v-for="university in record.fields['Universities']" :key="university">{{ university }}</md-chip>
          </div>
          <span class="card__content" v-else>Not assigned</span>
        </md-card>
        <md-card class="card--white flex--weight-1">
          <small>Mentor:</small>
          <div class="card__content" v-if="record.fields['Mentors']">
            <md-chip class="margin--5-2" v-for="mentor in record.fields['Mentors']" :key="mentor">{{ mentor }}</md-chip>
          </div>
          <span class="card__content" v-else>Not assigned</span>
        </md-card>
      </div>
    </div>
    <div class="button-group">
      <b-button variant="link" class="text-decoration-none" @click="sendButtonEventToParent(record.id)"><md-icon>delete</md-icon></b-button>
      <b-button variant="link" class="text-decoration-none" @click="$router.push({ name: 'EditProjectPage', params: { recordId: record.id} })"><md-icon>edit</md-icon></b-button>
      <b-button variant="link" class="text-decoration-none" @click="$router.push({ name: 'ProjectDetailPage', params: { recordId: record.id} })"><md-icon>visibility</md-icon></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectListExpandPreview',
  props: [
    'record'
  ],
  methods: {
    sendButtonEventToParent: function (arg) {
      var messageTitle = 'messageFrom' + this.$options.name
      this.$emit(messageTitle, 'deleteRecord', arg)
    }
  }
}
</script>

<style scoped>
  .project__preview {
    box-sizing: border-box;
    width: inherit;
    height: fit-content;
    padding: .8em;
    justify-content: space-between;
    background-color: #EBECED;
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
</style>
