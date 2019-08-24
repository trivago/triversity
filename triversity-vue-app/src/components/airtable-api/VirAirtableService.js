import VueAirtable from './VueAirtable'

export default {
  getRecords: function (table, filter, sort) {
    return VueAirtable.get(
      `${table}`, {
        params: {
          filterByFormula: filter || '',
          sort: sort || ''
        }
      }
    )
  },
  createRecord: function (table, data) {
    VueAirtable.defaults.headers['Content-Type'] = 'application/json'
    return VueAirtable.post(`${table}`, data)
  },
  updateRecord: function (table, recordId, data) {
    VueAirtable.defaults.headers['Content-Type'] = 'application/json'
    return VueAirtable.post( `${table}/${recordId}`, data)
  },
  deleteRecord: function (table, recordId) {
    return VueAirtable.delete( `${table}/${recordId}`)
  }
}
