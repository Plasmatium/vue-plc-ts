interface PLCBlock {
  lineIn: (newVal: boolean) => void
  toString: () => boolean
  pe: () => boolean
  ne: () => boolean
  Q?: boolean // output of PLC Block
  readonly token: symbol // for the entrance of closure
}

interface StateClosure {
  // token should be a symbol
  [token: string]: {
    posEdge: boolean
    negEdge: boolean
  }
}