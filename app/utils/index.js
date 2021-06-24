exports.cwd = (...p) => require('path').join(__dirname, '..', ...p)

exports.waitFor = (s) => {
  return new Promise((resolve) => {
    setTimeout(resolve, s)
  })
}

/**
 * 单位: 秒
 */
exports.createCounter = (triggerCount, cb) => {
  let count = 0
  const resetCount = () => (count = 0)

  setInterval(() => {
    if (count >= triggerCount) {
      cb()
      resetCount()
    }

    count++
  }, 1000)

  return {
    resetCount,
  }
}

/**
 * 单位: 秒
 */
exports.createColdDown = (cdTime) => {
  let interval
  let count = 0
  let isInColdDown = false

  const activeColdDown = () => {
    count = 0
    isInColdDown = true

    interval = setInterval(() => {
      if (count >= cdTime) {
        isInColdDown = false
        clearInterval(interval)
      }

      count++
    }, 1000)
  }

  return {
    checkIsInColdDown: () => isInColdDown,
    activeColdDown,
  }
}
