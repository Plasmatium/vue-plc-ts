// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import App from './App.tsx.vue'

import { setSeed, random } from './utils/random-seed'
setSeed(3.14)
console.log(random())
console.log(random())

setSeed(1111)
console.log(random())
console.log(random())

setSeed(3.14)
console.log(random())
console.log(random())

/* eslint-disable no-new */
let v = new Vue({
  el: "#app",
  store,
  template: '<App />',
  components: { App }
});
