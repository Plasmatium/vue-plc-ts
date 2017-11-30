import Vue from 'vue'

import {BaseBlock} from '../src/PLC/PLCBlock'

describe('BaseBlock in Vue data', function () {
  let {tBlock, fBlock, dBlock} = {
    tBlock: new BaseBlock(true),
    fBlock: new BaseBlock(false),
    dBlock: new BaseBlock()
  }
  let v = new Vue({
    data () {
      return {
        tBlock,
        fBlock,
        dBlock
      }
    }
  })
  describe('tBlock', () => {
    describe('#Q', () => {
      it('should equal true', () => {
        tBlock.Q.should.equal(true)
      })
    })
    describe('#toString', () => {
      it('should return true', () => {
        tBlock.toString().should.equal(true)
      })
    })

    function easyLineIn (
      block: BaseBlock,
      lineIn: boolean,
      Q: boolean,
      toString: boolean,
      pe: boolean,
      ne: boolean
    ) {
      block.lineIn(lineIn)
      block.Q.should.equal(Q)
      block.toString().should.equal(toString)
      block.pe().should.equal(pe)
      block.ne().should.equal(ne)
    }

    describe('#lineIn', () => {
      it('lineIn(true), Q -> true, ne & pe -> false', () => {
        easyLineIn(tBlock, true, true, true, false, false)
      })
      it('lineIn(false), Q -> true, ne -> true, pe -> false', () => {
        easyLineIn(tBlock, false, false, false, false, true)
      })
      it('lineIn(false) Q -> false, pe & ne -> false', () => {
        easyLineIn(tBlock, false, false, false, false, false)
      })
      it('lineIn(true) Q -> true, pe -> true, ne -> false', () => {
        easyLineIn(tBlock, true, true, true, true, false)
      })
    })
  })
})