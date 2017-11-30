<template>
  <div id="app">
    <img src="./assets/logo.png">
    <HelloWorld/>
    <input type="checkbox" v-model="di0" @click="clki0">i0</input>
    <input type="checkbox" v-model="di1" @click="clki1">i1</input>
    <hr>
    <div>{{holderQ}}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from './components/HelloWorld.vue'
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
      Q.lineIn((i1^1)*10 + Q)
      return Q.toString()
    }
  },
  methods: {
    clki0: function () {
      console.log('clki0:', this.di0)
    },
    clki1: function () {
      console.log('chki1:', this.di1)
    }
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
