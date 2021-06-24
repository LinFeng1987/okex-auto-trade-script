const { state, setState } = require('../store/state')

const ctx = { state, setState }

setState({
  maxStep: 9,
})

ctx.setState({
  currentStep: 1,
})

console.log(state)
