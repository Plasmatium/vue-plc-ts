import { shallow } from 'vue-test-utils'
import Vue from 'vue'
import App from '../src/App.vue'

describe('App.vue', () => {
  const wrapper = shallow(App)
  let inputs = wrapper.findAll("input")
  let ip0 = inputs.at(0)
  let ip1 = inputs.at(1)
  let Q = wrapper.find('#result')

  it('Q should be false at first', () => {
    Q.text().should.equal('false')
  })
  it('Q should be true after i0 on', () => {
    ip0.trigger('click')
    Q.text().should.equal('true')
  })
  it('Q should remain true after i0 off', () => {
    ip0.trigger('click')
    Q.text().should.equal('true')
  })
  it('Q should be false after i1 on', () => {
    ip1.trigger('click')
    Q.text().should.equal('false')
  })
  it('Q should remain false after i0 on & i1 on', () => {
    ip0.trigger('click')
    Q.text().should.equal('false')
  })
})