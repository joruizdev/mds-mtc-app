/* eslint-disable react/jsx-closing-tag-location */
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useRef, useState } from 'react'
import { postRequest } from '../../services/services'
import { notificationError } from '../../notifications/notifications'
import ModalAppointment from './modalAppointment'
import Spinner from '../../components/spinner'

const Appointment = () => {
  const [token, setToken] = useState(null)
  const [reload, setReload] = useState(false)
  const [campus, setCampus] = useState('')
  const [userId, setUserId] = useState(null)
  const [event, setEvent] = useState([])
  const [eventEdit, setEventEdit] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [textTitle, setTextTitle] = useState('Reservar cita')
  const [disabled, setDisabled] = useState(false)
  const [pending, setPending] = useState(true)
  const div = useRef()
  const calendar = useRef()

  const loadAppointment = () => {
    setPending(true)
    if (token) {
      postRequest('appointment/filtercampus', { campus }, token)
        .then(response => {
          setEvent([])
          // eslint-disable-next-line array-callback-return
          response.map((elem) => {
            const date = elem.appointmentdate.split('T')[0]
            const newDate = new Date(date + 'T' + elem.appointmenttime)
            const secondTime = new Date(newDate).getTime()
            const addTime = 15 * 60000
            const newResponse = {
              ...elem,
              start: new Date(newDate).toISOString(),
              end: new Date(secondTime + addTime).toISOString(),
              title: `${elem.postulant.name} ${elem.postulant.lastname} | ${elem.typelic} | ${elem.campus} | ${elem.confirmed ? 'Confirmado' : elem.attended ? 'Atendido' : ''} ${elem.canceled ? 'Cancelado' : ''} ${elem.attended ? 'Atendido' : ''}`,
              appointmentId: elem.id,
              backgroundColor: elem.confirmed ? 'rgb(22 163 74)' : (elem.canceled ? 'rgb(239 68 68)' : 'rgb(44 112 182)'),
              borderColor: 'transparent',
              className: ['cursor-pointer', 'hover:contrast-200', 'capitalize']
            }
            setEvent(event => event.concat(newResponse))
          })

          setPending(false)
        })
        .catch(error => {
          console.error(error)
          notificationError()
        })
    }
  }

  useEffect(() => {
    loadAppointment()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, token])

  useEffect(() => {
    setReload(false)
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      setUserId(user.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reload])

  const handleReload = () => {
    setReload(true)
  }

  const handleShowModal = () => {
    setShowModal(false)
  }

  const showInfo = (info) => {
    info.jsEvent.preventDefault()
    if (!info.event._def.extendedProps.confirmed && !info.event._def.extendedProps.canceled) {
      setTextTitle('Actualizar cita')
      setDisabled(true)
      setEventEdit(info.event._def.extendedProps)
      setShowModal(true)
    }
  }
  return (
    <>
      {
      showModal
        ? <ModalAppointment
            show={handleShowModal}
            token={token}
            user={userId}
            event={event}
            reload={handleReload}
            campus={campus}
            eventEdit={eventEdit}
            textTitle={textTitle}
            disabled={disabled}
          />
        : ''
        }
      {
        !pending
          ? <div ref={div} className='container mx-auto shadow-sm p-5 bg-white rounded-lg font-nunito'>
            <FullCalendar
              ref={calendar}
              locale='es'
              allDaySlot={false}
              slotMinTime='08:00:00'
              slotMaxTime='18:00:00'
              expandRows
              height='auto'
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              selectable
              initialView='timeGridWeek'
              slotDuration='00:15:00'
              slotLabelInterval='00:15:00'
              eventClick={(info) => showInfo(info)}
              slotLabelFormat={
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  omitZeroMinute: false,
                  meridiem: 'short'
                }
              }
              events={event}
              hiddenDays={[0]}
              buttonText={
                {
                  day: 'Día',
                  week: 'Semana',
                  list: 'Listar'
                }
              }
              customButtons={
                {
                  myCustomButton: {
                    text: 'Reservar cita',
                    click: () => {
                      setTextTitle('Reservar nueva cita')
                      setShowModal(true)
                      setEventEdit([])
                      setDisabled(false)
                    }
                  },
                  myCustomButtonPrev: {
                    text: 'Prev',
                    icon: 'chevron-left',
                    click: () => {
                    }
                  },
                  myCustomButtonNext: {
                    text: 'Next',
                    icon: 'chevron-right',
                    click: () => {
                    }
                  }
                }
              }
              headerToolbar={
                {
                  left: 'timeGridWeek myCustomButton',
                  center: 'title',
                  right: 'listWeek prev,next'
                }
              }
              views={
                {
                  listweek: { buttonText: 'list week' },
                  dayGridMonth: { // name of view
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                    // other view-specific options here
                  }
                }
              }
            />
          </div>
          : <div className='flex h-screen m-auto'><Spinner /></div>
      }

    </>
  )
}

export default Appointment
