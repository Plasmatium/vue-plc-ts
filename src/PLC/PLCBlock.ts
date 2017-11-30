export  class BaseBlock implements PLCBlock {
  private static stateClosure: StateClosure = {}
  readonly token: symbol = Symbol('token for closure')
  Q: boolean
  constructor (initVal?: boolean) {
    this.Q = Boolean(initVal)
    BaseBlock.stateClosure[this.token] = {
      posEdge: false,
      negEdge: false
    }
  }
  toString () {
    return this.Q
  }
  lineIn (newVal: boolean | number) {
    newVal = Boolean(newVal)
    let closure = BaseBlock.stateClosure[this.token]
    if (newVal === this.Q) {
      // this.Q: true -> true | false -> false
      closure.negEdge = closure.posEdge = false
      return
    }
    if (<any>this.Q - <any>newVal === 1) {
      // this.Q: true -> false
      closure.negEdge = true
      closure.posEdge = false
    } else {
      // this.Q: false -> true
      closure.posEdge = true
      closure.negEdge = false
    }
    this.Q = newVal
  }
  ne () {
    return BaseBlock.stateClosure[this.token].negEdge
  }
  pe () {
    return BaseBlock.stateClosure[this.token].posEdge
  }
}
