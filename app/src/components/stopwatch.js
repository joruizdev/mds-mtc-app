import React, { useEffect, useState } from 'react'
import { putRequest } from '../services/services'
import { useStopwatch } from 'react-timer-hook'
import ButtonStopwatch from './buttonStopwatch'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import iconAlarm from '../aseets/icon-alarm.gif'
import { notificationError } from '../notifications/notifications'

function Stopwatch ({
  id, postulant, typelic, date, timestart, timeend, timeclose, initiated, closed, canceled, order, click, typeuser, token, campus
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
    order,
    campus
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        .catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return notificationError('Sesión expidada, por favor cierre sesión e inicie nuevamente')
          notificationError()
        })
    }
  }

  const handleClose = async () => {
    if (!newClosed && newInitiated) {
      const date = new Date()
      const newdata = {
        ...data,
        timeclose: new Date(date).toISOString(),
        closed: true
      }
      await putRequest('records', newdata, token)
        .then(data => {
          console.log(data)
          setBtnCloseClassName('btn-disabled')
          setBtnResetClassName('btn-disabled')
          setClassOrder('icon-close')
          setNewTimeClose(date)
          setNewClosed(true)
          pause()
        })
        .catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return notificationError('Sesión expidada, por favor cierre sesión e inicie nuevamente')
          notificationError()
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
      }).then(async result => {
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
          await putRequest('records', newData, token)
            .then(data => {
              setNewTimeStart(new Date())
              setNewInitiated(true)
              setNewTimeEnd(newTime)
              reset()
            })
            .catch(e => {
              console.log(e)
              if (e.response.data.error === 'token expired') return notificationError('Sesión expidada, por favor cierre sesión e inicie nuevamente')
              notificationError()
            })
        }
      })
    }
  }

  return (
    <>
      <div className='relative flex flex-col text-sm leading-6 items-start bg-white py-10 px-4 rounded-lg shadow-lg border-stone-100 border-2 hover:border-mds-yellow hover:border-2 hover:scale-105 hover:transition-all'>
        <div className={classOrder}>{order}</div>
        <div className='pt-4'>
          <p>Nombres:
            <strong className='capitalize'>
              {' ' + String(postulant.name + ' ' + postulant.lastname).toLowerCase()}
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
          <p>Local:
            <strong>
              {' ' + campus}
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
        <div className='flex pt-4 justify-between items-center w-full'>
          <div className=''>
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
          <div className=''>
            {
              Number(String(hours) + (String(minutes).length === 1 ? `0${minutes}` : minutes) + (String(seconds).length === 1 ? `0${seconds}` : seconds)) > 31500 && !closed
                ? <img src={iconAlarm} alt='Icon-alarm' className='h-20' />
                : ''
            }
          </div>
        </div>
      </div>
    </>

  )
}

export default Stopwatch
