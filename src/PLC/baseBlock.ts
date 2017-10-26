import * as objectPath from 'object-path'

interface DPTR {
  type: string
  name: string
  qInit?: boolean // Output 'Q' init value
}

interface LogicFuncParam {
  [paramName: string]: any
}


// Block params, not reactive. It could be reactive by other 
// block's "Q" output.
interface BPARAM {
  name: string
  linePath?: string
  init: any
}

interface INPUT {
  name: string
  linePath: string
  init?: boolean
}

interface SHAPE {
  // 子块结构描述
  subBlocks: DPTR[]

  // 块的参数，非响应（避免不必要的响应式触发，若需要，可由罗技快触发）
  // 参数中的linePath可提供直连subBlocks中下一层参数，如高级计数器的init直连
  // 下一层普通计数器的init（假设高级计数器由普通计数器和其他逻辑块组成）
  params?: BPARAM[]

  // 逻辑电平输入，响应式。其linePath同上面params
  inputs?: INPUT[]

  //逻辑运算实体
  logic: (param: LogicFuncParam) => void
}

const BaseBlock = class {} // just for type assertion

const Relay = class {
  state: boolean
  getLast: () => {
    val: boolean,
    set: (newVal: boolean) => void
  }
  constructor (dptr: DPTR) {
    this.state = false || Boolean(dptr.qInit)
    this.getLast = () => {
      let val = this.state
      return {val, set: (newVal) => { val = newVal }}
    }
  }
  toString (): boolean {
    return Boolean(this.state)
  }
  lineIn (newState: boolean | Number) {
    newState = Boolean(newState)
    this.getLast().set(newState)
    if (newState === this.state) return
    this.state = newState
  }
  pe () {
    if (this.getLast().val === false && this.state === true) {
      return true
    } else {
      return false
    }
  }
  ne () {
    if (this.getLast().val === true && this.state === false) {
      return true
    } else {
      return false
    }
  }
}

const RunningBlock = class {
}

const makeClosure = () => {
  let closure = {}
  return () => closure
}

const SubBlock = class {
  [propName: string]: any
  constructor (ownShape: SHAPE) {
    // 注入所有子块到this
    ownShape.subBlocks.forEach(dptr => {
      let {type, name, qInit} = dptr
      let M = Maker[type]
      this[name] = new M()
    })

    // 注入所有param参数至闭包
    this.paramsClosure = makeClosure()
    ownShape.params && ownShape.params.forEach(param => {
      let {name, init} = param
      // 将参数实体注入到闭包中，而不是this中（否则会被vue响应）
      this.paramsClosure()[name] = init
    })

    // 注入所有input到this
    // TODO:
    ownShape.inputs && ownShape.inputs.forEach(input => {})
  }
}

// Maker
interface IMaker {
  [blockName: string]: any
}
const Maker: IMaker = {
  Relay
}