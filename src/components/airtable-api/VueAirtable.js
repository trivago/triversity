import axios from 'axios'

const apiUrl = 'https://api.airtable.com/v0/'
const base = process.env.AIRTABLE_API_BASE

const headers = {
  'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
}

export default axios.create({
  baseURL: apiUrl + base,
  headers: headers
})
