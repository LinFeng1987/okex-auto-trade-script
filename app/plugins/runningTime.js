const oneSecondMS = 1000
const oneMinuteMS = 60 * oneSecondMS
const oneHourMS = 60 * oneMinuteMS
const oneDayMS = 24 * oneHourMS

exports.name = '运行时长'

exports.apply = (ctx) => {
  const { setState, emitter } = ctx
  const startTimeMS = Date.now()

  emitter.on('ping', () => {
    setState({
      runningTime: calcRunningTime(startTimeMS),
    })
    emitter.emit('printLog')
  })
}

function calcRunningTime(startTimeMS) {
  const currentTimeMS = Date.now()
  const diffTimeMS = currentTimeMS - startTimeMS

  const diffDays = Math.floor(diffTimeMS / oneDayMS)

  const restHoursMS = diffTimeMS % oneDayMS
  const diffHours = Math.floor(restHoursMS / oneHourMS)

  const restMinutesMS = restHoursMS % oneHourMS
  const diffMinutes = Math.floor(restMinutesMS / oneMinuteMS)

  const restSecondsMS = restMinutesMS % oneMinuteMS
  const diffSeconds = Math.floor(restSecondsMS / oneSecondMS)

  let res = `${diffSeconds} 秒`
  if (diffMinutes >= 1) res = `${diffMinutes} 分 ` + res
  if (diffHours >= 1) res = `${diffHours} 时 ` + res
  if (diffDays >= 1) res = `${diffDays} 天 ` + res

  return res
}
