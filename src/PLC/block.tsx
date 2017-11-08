import Vue from 'vue'
import {mapState} from 'vuex'

export default Vue.component('block', {
  functional: true,
  render (h, context) {
    return h('h1', 'hello!')
  }
})
