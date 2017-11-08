import Vue from 'vue'
import Vuex from 'vuex'

import Maker from './PLC/baseBlock'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    block: new Maker.Holder()
  }
})

export default store