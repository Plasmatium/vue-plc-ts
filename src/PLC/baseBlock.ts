import * as objectPath from 'object-path'

interface REACTIVECLOSURE<T> {
  val: T
  toString: () => T
  lineIn: (newVal: T) => void
}

const createReactiveClosure = function<T> (initVal: T): REACTIVECLOSURE<T> {
  let rslt: any = {val: initVal}
  let toString = () => rslt.val
  let lineIn = (newVal: T) => {
    if (newVal === rslt.val) { return }
    else { rslt.val = newVal }
  }
  (<any>Object).assign(rslt, {toString, lineIn})
  return <REACTIVECLOSURE<T>>rslt
}

interface NONEREACTIVECLOSURE<T> {
  // val: T ===> 将存储在createNoneReactiveClosure闭包中
  toString: () => T
  lineIn: (newVal: T) => void
}

const createNoneReactiveClosure = function<T> (initVal: T): NONEREACTIVECLOSURE<T> {
  let closureVal = initVal
  return {
    toString: () => closureVal,
    lineIn: (newVal: T) => {
      if (newVal === closureVal) { return }
      else { closureVal = newVal }
    }
  }
}

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
  init: any // 必须初始化
}

interface INPUT {
  name: string
  linePath?: string
  init: boolean // 必须初始化
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

  // TODO: 需要有一个output，指定一个path，关联到本体的lineIn，toString，pe和ne

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
    debugger
    this.state = false || Boolean(dptr && dptr.qInit)
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


const SubBlock = class {
  [propName: string]: any
  constructor (shape: SHAPE) {
    // 注入所有子块到this，以及子块的子块（递归注入）
    shape.subBlocks.forEach(dptr => {
      let {type, name, qInit} = dptr
      let M = Maker[type]
      this[name] = new M()
    })

    // 注入所有param参数至闭包
    shape.params && shape.params.forEach(param => {
      // 将参数实体注入到闭包中，而不是this中（否则会被vue响应）
      this.insertElement(param, createNoneReactiveClosure)
    })

    // 注入所有input到this，并根据linePath连接到坐实的具体变量上
    shape.inputs && shape.inputs.forEach(input => {
      this.insertElement(input, createReactiveClosure)
    })

    this.logic = shape.logic
  }
  
  // 注入函数，将param或者input注入到this中
  // INITTYPE是函数参数element中init的类型
  // ETYPE是createFunc的返回类型，是响应闭包或者非响应闭包
  // FUNCTYPE是为了约束createFunc只在createNoneReactiveClosure
  // 和createReactiveClosure中选择
  insertElement<INITTYPE, 
  ETYPE extends REACTIVECLOSURE<INITTYPE> | NONEREACTIVECLOSURE<INITTYPE>,
  FUNCTYPE extends (typeof createReactiveClosure | typeof createNoneReactiveClosure)>
  (element: INPUT | BPARAM,
    createFunc: FUNCTYPE): void {
    let {name, init, linePath} = element
    let closure: ETYPE
    if (linePath) {
      closure = <ETYPE>objectPath.get(this, linePath)
      if (!closure) { throw Error(`input path ${linePath} invalid on ${this}`)}
      closure.lineIn(init)
    } else {
      closure = createFunc(init)
    }
    this[name] = closure
    // TODO: defineProperty this[name], set -> lineIn, get -> toString
  }

  run () {
    this.logic(this)
  }
  
  // TODO: 需要完成 this.pe, this.ne, this.toString
}
// Maker
interface IMaker {
  [blockName: string]: any // TODO: 需要指定详细类型
}
const Maker: IMaker = {
  Relay
}

// 预制模块的描述表
const holderShape: SHAPE = {
  subBlocks: [
    {name: 'q0', type: 'Relay'}
  ],
  inputs: [
    {name: 'i0', init: false},
    {name: 'i1', init: false}
  ],
  logic: ({i0, i1, q0}) => {
    q0.lineIn((i1 ^ 1) * i0 + q0)
  }
}

// const holder = /*some function*/
// TODO: 重写Holder为一个类，继承自SubBlock
debugger