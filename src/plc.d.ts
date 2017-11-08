interface EDGE {
  pe: () => boolean
  ne: () => boolean
}

interface RELAY extends EDGE {
  toString: () => boolean
  lineIn: (newVal: boolean | number | string) => void
}

interface REACTIVECLOSURE
<T extends (boolean | number | string)> {
  val: T
  toString: () => T
  lineIn: (newVal: T) => void
}

interface NONEREACTIVECLOSURE
<T extends (boolean | number | string)> {
  // val: T ===> 将存储在createNoneReactiveClosure闭包中
  toString: () => T
  lineIn: (newVal: T) => void
}

interface DPTR {
  type: string
  name: string
  qInit?: boolean // Output 'Q' init value
}

interface LogicFuncParam {
  [paramName: string]: any // type 'any' for invoke 'toString()' by using '+-*/^'
}

// base interface for IPARAM and INPUT
interface IARGUMENT {
  name: string
  linePath?: string
  init: any
}

interface IPARAM extends IARGUMENT{
  name: string
  linePath?: string
  init: (boolean | number | string) // 必须初始化
}

interface INPUT extends IARGUMENT {
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
  params?: IPARAM[]

  // 逻辑电平输入，响应式。其linePath同上面params
  inputs?: INPUT[]

  // 需要有一个output，指定一个path，关联到本体的lineIn，toString，pe和ne
  output: string
  //逻辑运算实体
  logic: (param: LogicFuncParam) => void
}

// IMaker用于包罗Relay（implements RELAY）
// 和所有SubBlock（implements RELAY）类型
interface IMaker {
  [blockName: string]: {
    new(initVal?: any): RELAY
  }
}
