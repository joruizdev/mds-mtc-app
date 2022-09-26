import { useTime } from 'react-timer-hook'

const Time = () => {
  const {
    seconds,
    minutes,
    hours
  } = useTime({})

  return (
    <>
      <span>{String(hours).length === 1 ? `0${hours}` : hours}</span>
      :<span>{String(minutes).length === 1 ? `0${minutes}` : minutes}</span>
      :<span>{String(seconds).length === 1 ? `0${seconds}` : seconds}</span>
    </>
  )
}

export default Time
