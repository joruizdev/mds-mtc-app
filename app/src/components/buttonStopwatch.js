const ButtonStopwatch = ({
  btnStartClassName,
  btnCloseClassName,
  btnResetClassName,
  handleStart,
  handleClose,
  reset
}) => {
  return (
    <>
      <button className={btnStartClassName} onClick={handleStart}>Start</button>
      <button className={btnCloseClassName} onClick={handleClose}>Close</button>
      <button className={btnResetClassName} onClick={reset}>Reset</button>
    </>
  )
}

export default ButtonStopwatch
