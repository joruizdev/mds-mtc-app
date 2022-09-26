import React, { useEffect, useState } from 'react'
import { putRequest } from '../services/services'
import { useStopwatch } from 'react-timer-hook'
import ButtonStopwatch from './buttonStopwatch'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Stopwatch ({
  id, postulant, typelic, date, timestart, timeend, timeclose, initiated, closed, canceled, order, click, typeuser, token
}) {
  const data = {
    id,
    postulant,
    typelic,
    date,
    timestart,
    timeend,
    timeclose,
    initiated,
    closed,
    canceled,
    order
  }

  const {
    seconds,
    minutes,
    hours,
    start,
    pause,
    reset
  } = useStopwatch({ autoStart: false })

  const [newTimeStart, setNewTimeStart] = useState(new Date(timestart))
  const [newTimeEnd, setNewTimeEnd] = useState(new Date(timeend))
  const [newTimeClose, setNewTimeClose] = useState(new Date(timeclose))
  // const [token, setToken] = useState(null)

  const [newInitiated, setNewInitiated] = useState(initiated)
  const [newClosed, setNewClosed] = useState(closed)

  const [btnStartClassName, setBtnStartClassName] = useState('btn-yellow')
  const [btnCloseClassName, setBtnCloseClassName] = useState('btn-disabled')
  const [btnResetClassName, setBtnResetClassName] = useState('btn-disabled')
  const [classOrder, setClassOrder] = useState('icon-no-start')

  useEffect(() => {
    if (newInitiated) {
      setBtnStartClassName('btn-disabled')
      setBtnCloseClassName('btn-yellow')
      setBtnResetClassName('btn-yellow')
      setClassOrder('icon-start')
      const stopwatchOffset = new Date()
      const secondTime = new Date().getTime() - new Date(newTimeStart).getTime()
      stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + Math.round(secondTime / 1000))
      reset(stopwatchOffset)
    }

    if (newClosed) {
      setBtnCloseClassName('btn-disabled')
      setBtnStartClassName('btn-disabled')
      setBtnResetClassName('btn-disabled')
      setClassOrder('icon-close')
      const stopwatchOffset = new Date()
      const secondTime = new Date(newTimeClose).getTime() - new Date(newTimeStart).getTime()

      stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + Math.round(secondTime / 1000))
      reset(stopwatchOffset)
      pause()
    }
  }, [])

  const handleStart = async () => {
    if (!newInitiated) {
      const secondTime = new Date().getTime()
      const addTime = 180 * 60000
      const newTime = new Date(secondTime + addTime)

      const newData = {
        ...data,
        timestart: new Date().toISOString(),
        timeend: newTime.toISOString(),
        initiated: true
      }
      await putRequest('records', newData, token)
        .then(data => {
          console.log(data)
          setNewTimeStart(new Date())
          setNewInitiated(true)
          setNewTimeEnd(newTime)
          setBtnStartClassName('btn-disabled')
          setBtnCloseClassName('btn-yellow')
          setBtnResetClassName('btn-yellow')
          setClassOrder('icon-start')
          start()
        })
    }
  }

  const handleClose = async () => {
    if (!newClosed && newInitiated) {
      const date = new Date()
      setBtnCloseClassName('btn-disabled')
      setBtnResetClassName('btn-disabled')
      setClassOrder('icon-close')
      setNewTimeClose(date)
      setNewClosed(true)

      const newdata = {
        ...data,
        timeclose: new Date(date).toISOString(),
        closed: true
      }
      await putRequest('records', newdata, token).then(data => {
        console.log(data)
        pause()
      })
    }
  }

  const handleReset = () => {
    if (!newClosed && newInitiated) {
      const MySwal = withReactContent(Swal)
      MySwal.fire({
        text: '¿Esta seguro de reiniciar el record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2c70b6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, quiero reiniciar'
      }).then(result => {
        if (result.isConfirmed) {
          const secondTime = new Date().getTime()
          const addTime = 180 * 60000
          const newTime = new Date(secondTime + addTime)

          const newData = {
            ...data,
            timestart: new Date().toISOString(),
            timeend: newTime.toISOString(),
            initiated: true
          }
          putRequest('records', newData, token)
            .then(data => {
              setNewTimeStart(new Date())
              setNewInitiated(true)
              setNewTimeEnd(newTime)
              reset()
            })
        }
      })
    }
  }

  return (
    <>
      <div className='relative flex flex-col text-sm leading-6 items-start bg-white py-5 px-4 rounded-lg shadow-lg border-stone-100 border-2 hover:border-mds-yellow hover:border-2'>
        <div className={classOrder}>{order}</div>
        <div className='pt-4'>
          <p>Nombres:
            <strong>
              {' ' + postulant.name + ' ' + postulant.lastname}
            </strong>
          </p>
          <p>Nro de documento:
            <strong>
              {' ' + postulant.nrodoc}
            </strong>
          </p>
          <p>Tipo de licencia:
            <strong>
              {' ' + typelic}
            </strong>
          </p>
        </div>
        <div className='container mx-auto text-center text-5xl py-2'>
          <div className=' flex items-center justify-center py-5 text-center'>
            <span>{String(hours).length === 1 ? `0${hours}` : hours}</span>
            :
            <span>{String(minutes).length === 1 ? `0${minutes}` : minutes}</span>
            :
            <span>{String(seconds).length === 1 ? `0${seconds}` : seconds}</span>
          </div>
        </div>
        <div className='container mx-auto text-center flex items-center justify-center gap-2'>
          {
            typeuser.toLowerCase() !== 'admisión' &&
              <ButtonStopwatch
                btnStartClassName={btnStartClassName}
                btnCloseClassName={btnCloseClassName}
                btnResetClassName={btnResetClassName}
                handleStart={handleStart}
                handleClose={handleClose}
                reset={handleReset}
              />
          }
        </div>
        <div className='pt-4'>
          <p>Inicio de ficha:
            <strong>
              {newInitiated === true ? `${newTimeStart.toLocaleTimeString()}` : ''}
            </strong>
          </p>
          <p>Cierre máximo de ficha:
            <strong>
              {newInitiated === true ? `${newTimeEnd.toLocaleTimeString()}` : ''}
            </strong>
          </p>
          <p>Cierre de ficha:
            <strong>
              {newClosed === true ? `${newTimeClose.toLocaleTimeString()}` : ''}
            </strong>
          </p>
        </div>
      </div>
    </>

  )
}

export default Stopwatch
