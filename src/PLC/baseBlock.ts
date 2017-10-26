interface DPTR {
  type: String,
  name: String,
  qInit?: Boolean // Output 'Q' init value
}

interface shape {
  subBlocks: Object,
  interface: Object,
}

const INPUT = class {
  state: Boolean
  getLast: () => {
    val: Boolean,
    set: (newVal: Boolean) => void
  }
  constructor (dptr: DPTR) {
    this.state = false || Boolean(dptr.qInit)
    this.getLast = () => {
      let val = this.state
      return {val, set: (newVal) => { val = newVal }}
    }
  }
  toString (): Boolean {
    return Boolean(this.state)
  }
  lineIn (newState: Boolean | Number) {
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
  constructor (dptr: DPTR) {
  }
}