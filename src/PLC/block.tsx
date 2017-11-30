import Vue from 'vue'

// import {mapState} from 'vuex'

// let React = Vue

export default Vue.extend({
  functional: true,
  render (h, context) {
    // context.props.holder: {
    //   I0, I1, Q
    // }
    let a: string
    return (
      <div>
        <h1>Hello</h1>
        <h2>World</h2>
      </div>
    )
  }
})