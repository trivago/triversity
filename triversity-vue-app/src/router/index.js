import Vue from 'vue'
import Router from 'vue-router'
import ProjectListView from '@/components/ProjectListView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ProjectListView',
      component: ProjectListView,
      props: {
        base: 'appkmRgOBmQGWlfoc'
      }
    }
  ]
})
