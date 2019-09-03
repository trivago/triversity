# triversity-vue-app

> a vue.js project for the trivago university management tool

## Requirements

* Airtable account
* Filestack account
* vue cli application (`npm install -g @vue/cli`)

## Setup

To run this application you need an airtable token.
Get the token from here:...

You also need a FileStack token.

Create an `.env` file with the following contents:

```
VUE_APP_AIRTABLE_API_KEY=xxxxxxxxxxxxx
VUE_APP_AIRTABLE_API_BASE=xxxxxxxxxxxxx
VUE_APP_FILESTACK_API_KEY=xxxxxxxxxxxxx
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
