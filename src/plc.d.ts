interface PLCBlock {
  lineIn: (newVal: boolean) => void
  toString: () => boolean
  pe: () => boolean
  ne: () => boolean
  Q?: PLCBlock
}