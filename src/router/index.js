import Vue from 'vue'
import Router from 'vue-router'
import ProjectListView from '../components/ProjectListView'
import AddProjectPage from '../components/AddProjectPage'
import ProjectDetailPage from '../components/ProjectDetailPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ProjectListView',
      component: ProjectListView,
      props: {
        base: process.env.VUE_APP_AIRTABLE_API_BASE
      }
    },
    {
      path: '/AddProjectPage',
      name: 'AddProjectPage',
      component: AddProjectPage,
      props: {
        base: process.env.VUE_APP_AIRTABLE_API_BASE
      }
    },
    {
      path: '/AddProjectPage/:recordId',
      name: 'EditProjectPage',
      component: AddProjectPage,
      props: {
        base: process.env.VUE_APP_AIRTABLE_API_BASE
      }
    },
    {
      path: '/ProjectDetailPage/:recordId',
      name: 'ProjectDetailPage',
      component: ProjectDetailPage,
      props: {
        base: process.env.VUE_APP_AIRTABLE_API_BASE
      }
    }
  ]
})
