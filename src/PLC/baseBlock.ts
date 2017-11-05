import * as objectPath from 'object-path'

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

const BaseBlock = class {} // just for type assertion

const Relay = class implements RELAY {
  state: boolean
  getLast: () => {
    val: boolean,
    set: (newVal: boolean) => void
  }
  constructor (dptr?: DPTR) {
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


const SubBlock = class implements RELAY {
  [propName: string]: any
  constructor (shape?: SHAPE) {
    if (!shape) { throw Error('shape not defined') }
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
    
    //设置output（this.Q），注入pe，ne，toString方法
    if (!this[shape.output]) { throw Error(`output path invalid: ${shape.output}`) }
    this.Q = this[shape.output]
    // let methods = ['pe', 'ne', 'toString']
    // methods.forEach((method: string) => {
    //   this[method] = this.Q[method]
    // })
  }

  pe() { return this.Q.pe() }
  ne() { return this.Q.ne() }
  toString() { return this.Q.toString() }

  
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
  }

  run () {
    this.logic(this)
  }
}

class Holder extends SubBlock implements RELAY {
  constructor () {
    let holderShape: SHAPE = {
      subBlocks: [
        {name: 'q0', type: 'Relay'}
      ],
      inputs: [
        {name: 'i0', init: false},
        {name: 'i1', init: false}
      ],
      output: 'q0',
      logic: ({i0, i1, q0}) => {
        q0.lineIn((i1 ^ 1) * i0 + q0)
      }
    }
    super(holderShape)
  }
}

const Maker: IMaker = {
  Relay, // Relay实现了RELAY，但是不是RELAY，new Relay() 才是RELAY
  Holder,
  SubBlock
}

export default Maker
