import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useRef, useState } from 'react'
import { getRequest } from '../../services/services'
import { notificationError } from '../../notifications/notifications'
import ModalAppointment from './modalAppointment'

const Appointment = () => {
  const [token, setToken] = useState(null)
  const [reload, setReload] = useState(false)
  const [campus, setCampus] = useState('')
  const [event, setEvent] = useState([])
  const [eventEdit, setEventEdit] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [textTitle, setTextTitle] = useState('Reservar cita')
  const [disabled, setDisabled] = useState(false)
  const div = useRef()

  const loadAppointment = () => {
    getRequest('appointment')
      .then(response => {
        setEvent([])
        // eslint-disable-next-line array-callback-return
        response.map((elem) => {
          const date = elem.appointmentdate.split('T')[0]
          const newDate = new Date(date + 'T' + elem.appointmenttime)
          const secondTime = new Date(newDate).getTime()
          const addTime = 30 * 60000
          const newResponse = {
            ...elem,
            start: new Date(newDate).toISOString(),
            end: new Date(secondTime + addTime).toISOString(),
            title: elem.postulant.name + ' ' + elem.postulant.lastname + ' ' + elem.typelic,
            appointmentId: elem.id,
            backgroundColor: elem.confirmed ? 'rgb(22 163 74)' : 'rgb(44 112 182)'
          }
          setEvent(event => event.concat(newResponse))
        })
        setEvent(event => event.filter(item => item.canceled === false))
      })
      .catch(error => {
        console.error(error)
        notificationError()
      })
  }

  useEffect(() => {
    loadAppointment()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  useEffect(() => {
    setReload(false)
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
    }
  }, [token, reload])

  const handleReload = () => {
    setReload(true)
  }

  const handleShowModal = () => {
    setShowModal(false)
  }

  const showInfo = (info) => {
    info.jsEvent.preventDefault()
    if (!info.event._def.extendedProps.confirmed) {
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
            event={event}
            reload={handleReload}
            campus={campus}
            eventEdit={eventEdit}
            textTitle={textTitle}
            disabled={disabled}
          />
        : ''
        }
      <div ref={div} className='container mx-auto shadow-sm p-5 bg-white rounded-lg h-screen'>
        <FullCalendar
          locale='es'
          allDaySlot={false}
          slotMinTime='08:00:00'
          slotMaxTime='18:00:00'
          expandRows
          height='100vh'
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          selectable
          initialView='timeGridWeek'
          slotDuration='00:30:00'
          slotLabelInterval='00:30:00'
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
              }
            }
          }
          headerToolbar={
            {
              left: 'timeGridWeek,timeGridDay myCustomButton',
              center: 'title',
              right: 'listWeek prevYear,prev,next,nextYear'
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
    </>
  )
}

export default Appointment
