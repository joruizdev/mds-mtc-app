import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import ModalForm from '../../components/ModalForm'
// import Swal from 'sweetalert2'

const Appointment = () => {
  // eslint-disable-next-line no-unused-vars
  const [openModal, setOpenModal] = useState(false)

  const handleDateClick = (info) => { // bind with an arrow function
    // alert(info.dateStr)
    // showModal()
    openModal(true)
  }

  useEffect(() => {

  }, [openModal])

  const events = []

  /* const showModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    })

    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
    }
  } */

  return (
    <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
      {openModal ? <ModalForm /> : ''}
      <FullCalendar
        locale='es'
        allDaySlot={false}
        slotMinTime='08:00:00'
        slotMaxTime='18:00:00'
        expandRows
        height='100vh'
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        selectable
        initialView='timeGridWeek'
        slotDuration='00:30:00'
        slotLabelInterval='00:30:00'
        slotLabelFormat={
          {
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }
        }
        events={events}
        hiddenDays={[0]}
        headerToolbar={
          {
            left: 'timeGridWeek,timeGridDay',
            center: 'title',
            right: 'prevYear,prev,next,nextYear'
          }
        }
        views={
          {
            dayGridMonth: { // name of view
              titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
              // other view-specific options here
            }
          }
        }
      />
    </div>
  )
}

export default Appointment
