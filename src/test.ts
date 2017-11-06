import Vue from 'vue'

export default Vue.extend({
  template: `
  <a :href="'https://'+msg">This is a link to "{{msg}}"</a>
  `,
  data () {
    return { msg: 'baidu.com' }
  }
})