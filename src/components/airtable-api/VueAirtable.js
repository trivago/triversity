import axios from 'axios'

const apiUrl = 'https://api.airtable.com/v0/'
const base = process.env.VUE_APP_AIRTABLE_API_BASE

const headers = {
  'Authorization': `Bearer ${process.env.VUE_APP_AIRTABLE_API_KEY}`
}

export default axios.create({
  baseURL: apiUrl + base,
  headers: headers
})
