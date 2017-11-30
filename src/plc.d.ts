type nbs = number | boolean | string

declare class PLCBlock {
  lineIn: (newVal: boolean) => void
  toString: () => boolean
  pe: () => boolean
  ne: () => boolean
  Q?: boolean // output of PLC Block
  readonly token: symbol // for the entrance of closure
  private static stateClosure: StateClosure
}

declare class ExtBlock extends PLCBlock {
  static readonly structure: {
    [name: string]: ExtBlock | PLCBlock
  }
  params?: {
    [name: string]: any
  }
  subBlocks?: {
    [name: string]: ExtBlock
  }
}

interface StateClosure {
  // token should be a symbol
  [token: string]: {
    posEdge: boolean
    negEdge: boolean
  }
}