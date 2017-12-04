<template>
  <div id="app">
    <img src="./assets/logo.png">
    <HelloWorld/>
    <input type="checkbox" v-model="di0">i0</input>
    <input type="checkbox" v-model="di1">i1</input>
    <hr>
    <div id="result">{{holderQ}}</div>
  </div>
</template>

<script lang="tsx">
import Vue from 'vue'
import HelloWorld from './components/HelloWorld.tsx.vue'
import {BaseBlock} from './PLC/PLCBlock'

let holder = {
  i0: new BaseBlock(),
  i1: new BaseBlock(),
  Q: new BaseBlock()
}

export default Vue.extend({
  name: 'app',
  data () {
    return {
      holder,
      di0: false,
      di1: false
    }
  },
  computed: {
    holderQ: function () {
      let {i0, i1, Q}: {
        [name: string]: any
      } = this.holder

      i0.lineIn(this.di0)
      i1.lineIn(this.di1)
      Q.lineIn((i1^1)*(i0 + Q))
      return Q.toString()
    }
  },
  methods: {
  },
  components: {
    HelloWorld
  }
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
