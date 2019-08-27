import VueAirtable from './VueAirtable'

export default {
  getRecord: function (table, recordId) {
    return VueAirtable.get(`${table}/${recordId}`)
  },
  getRecords: function (table, filter, sort) {
    var url
    if (sort !== undefined) {
      url = `${table}?` + sort
    } else {
      url = `${table}`
    }
    return VueAirtable.get(url, { params: {
      filterByFormula: filter || ''
    }})
  },
  createRecord: function (table, data) {
    VueAirtable.defaults.headers['Content-Type'] = 'application/json'
    return VueAirtable.post(`${table}`, data)
  },
  updateRecord: function (table, recordId, data) {
    VueAirtable.defaults.headers['Content-Type'] = 'application/json'
    return VueAirtable.patch(`${table}/${recordId}`, data)
  },
  deleteRecord: function (table, recordId) {
    return VueAirtable.delete(`${table}/${recordId}`)
  }
}
