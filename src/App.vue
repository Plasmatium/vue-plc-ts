<template>
  <div id="app">
    <img src="./assets/logo.png">
    <HelloWorld/>
    <hr>
    <TEST />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import TEST from './test'
export default Vue.extend({
  name: 'app',
  data () {
    return {
    }
  },
  components: {
    HelloWorld,
    TEST
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
