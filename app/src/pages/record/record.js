/* eslint-disable react/jsx-indent */
import { postRequest, putRequest } from '../../services/services'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import RecordForm from './recordForm'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from '../../components/spinner'
import { useNavigate } from 'react-router-dom'
import { notificationError, notificationSuccess } from '../../notifications/notifications'

const Record = () => {
  const [token, setToken] = useState(null)
  const [typeUer, setTypeUer] = useState('')
  const [campus, setCampus] = useState('')
  const [records, setRecords] = useState([])
  const [reload, setReload] = useState(false)
  const [pending, setPending] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const [postulantAppointment, setPostulantAppointment] = useState([])
  const [appoinmentOpc, setAppointmentOpc] = useState(false)

  const [query, setQuery] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [count, setCount] = useState(0)

  const search = data => {
    return data.filter(
      item => item.postulant.name.toLowerCase().includes(query) ||
      item.postulant.lastname.toLowerCase().includes(query) ||
      item.postulant.nrodoc.toLowerCase().includes(query)
    )
  }

  const handleCancelRecord = (e, row) => {
    e.preventDefault()
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      text: `Por favor, indique el motivo por el cual quiere cancelar la atención del postulante ${row.postulant.lastname + ' ' + row.postulant.name}`,
      input: 'text',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar atención',
      confirmButtonColor: '#2c70b6',
      cancelButtonText: 'Regresar',
      preConfirm: (reason) => {
        if (reason.length > 0) {
          return reason
        } else {
          Swal.showValidationMessage(
            'Por favor indique el motivo'
          )
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = {
          id: row.id,
          reason: result.value,
          canceled: true
        }
        await putRequest('records', data, token)
          .then(response => {
            console.log(response)
            setReload(true)
            notificationSuccess('Se canceló la atención satisfactoriamente')
          })
          .catch(e => {
            console.log(e)
            if (e.response.data.error === 'token expired') return navigate('/session-expired')
            notificationError()
          })
      }
    })
  }

  useEffect(() => {
    setReload(false)
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      setTypeUer(user.typeuser)
      showRecords()
      showAppointments()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reload, date])

  const showAppointments = async () => {
    setCount(count + 1)
    if (token) {
      const newDate = new Date().toLocaleDateString().split('/').reverse().join('-')
      const data = {
        dateStart: newDate,
        dateEnd: newDate,
        campus,
        confirmed: true,
        attended: false,
        canceled: false
      }

      await postRequest('appointment/bydate', data, token)
        .then(response => {
          setAppointments(response)
        })
        .catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return navigate('/session-expired')
          notificationError()
        })
    }
  }

  const showRecords = async () => {
    setPending(true)
    setCount(count + 1)
    if (token) {
      const newDate = count === 1
        ? new Date().toLocaleDateString().split('/').reverse().join('-')
        : date
      const data = {
        dateStart: newDate,
        dateEnd: newDate,
        campus
      }
      await postRequest('records/bydate', data, token)
        .then(response => {
          setRecords(response)
          setPending(false)
        })
        .catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return navigate('/session-expired')
          notificationError()
        })
    }
  }

  const handleAttended = (e, row) => {
    e.preventDefault()
    setPostulantAppointment([])
    setPostulantAppointment(row)
    setAppointmentOpc(true)
    setShowModal(false)
  }

  const columnsAppointmentConfirmed = [
    {
      name: 'Apellidos y Nombres',
      selector: row => <span className='capitalize'>{String(row.postulant.name + ' ' + row.postulant.lastname).toLowerCase()}</span>,
      sortable: true
    },
    {
      name: 'Tipo de documento',
      selector: row => row.postulant.typedoc,
      sortable: true
    },
    {
      name: 'Nro. de Documento',
      selector: row => row.postulant.nrodoc,
      sortable: true
    },
    {
      name: 'Tipo de Lic.',
      selector: row => row.typelic,
      sortable: true
    },
    {
      name: 'Tipo de proc.',
      selector: row => row.typeproc,
      sortable: true
    },
    {
      name: 'Accion',
      cell: row => {
        if (row.attended) return ''
        if (!row.canceled) return <button className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-800' onClick={e => handleAttended(e, row)}>Atender cita</button>
      }
    }
  ]

  const columns = [
    {
      name: 'Apellidos y Nombres',
      selector: row => <span className='capitalize'>{String(row.postulant.name + ' ' + row.postulant.lastname).toLowerCase()}</span>,
      sortable: true
    },
    {
      name: 'Tipo de documento',
      selector: row => row.postulant.typedoc,
      sortable: true
    },
    {
      name: 'Nro. de Documento',
      selector: row => row.postulant.nrodoc,
      sortable: true
    },
    {
      name: 'Tipo de Lic.',
      selector: row => row.typelic,
      sortable: true
    },
    {
      name: 'Tipo de proc.',
      selector: row => row.typeproc,
      sortable: true
    },
    {
      name: 'Fecha',
      selector: row => String(new Date(row.date).toISOString().split('T')[0]).split('-').reverse().join('/'),
      sortable: true
    },
    {
      name: 'Estado',
      selector: row => {
        if (row.canceled) return 'Cancelado'
        if (row.closed) return 'Cerrado'
        if (row.initiated) {
          return 'Iniciado'
        } else {
          return 'No iniciado'
        }
      },
      sortable: true
    },
    {
      name: 'Accion',
      cell: row => {
        if (typeUer.toLowerCase() === 'admisión') return 'No tienes permisos'
        if (row.canceled || row.closed) return <button className='px-4 py-2 bg-slate-500 text-white rounded-md'>Cancelar</button>
        if (row.canceled === false) return <button className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400' onClick={e => handleCancelRecord(e, row)}>Cancelar</button>
      }
    }
  ]

  const conditionalRowStyles = [
    {
      when: row => row.canceled === true,
      style: {
        color: 'rgb(239 68 68)'
      }
    }
  ]

  return (
    <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
      <div className='flex justify-end'>
        <div className='relative inline-flex'>
          <button className='btn-yellow' onClick={() => setShowModal(true)}>Mostrar citas confirmadas</button>
          {
          (appointments.length > 0)
            ? <span className='flex absolute h-5 w-5 top-0 right-0 -mt-1 -mr-1'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75' />
              <span className='relative inline-flex rounded-full h-5 w-5 bg-green-500' />
              <span className='absolute left-2 text-white'>{appointments.length}</span>
              </span>
            : ''
          }
        </div>
      </div>
      {
        showModal
          ? <div className='fixed z-50 top-0 left-0 w-full h-screen bg-stone-500 bg-opacity-60'>
              <div className='container mx-auto flex justify-center items-center h-full'>
                <div className='container mx-auto bg-white p-10 rounded-lg relative'>
                  <div className='flex justify-end px-4'>
                    <button className='text-xl' onClick={() => setShowModal(false)}>
                      <span className='text-stone-500 h-6 w-6 text-5xl block outline-none focus:outline-none absolute z-[100]'>×</span>
                    </button>
                  </div>
                  <DataTable
                    title={`Lista de citas confirmadas del día ${new Date().toLocaleDateString()}`}
                    columns={columnsAppointmentConfirmed}
                    data={appointments}
                    pagination
                    highlightOnHover
                  />
                  <div className='pt-10'><button className='btn-red-dark' onClick={() => setShowModal(false)}>Cancelar</button></div>
                </div>
              </div>
            </div>
          : ''
      }

      <RecordForm token={token} records={records} campus={campus} postulantAppointment={postulantAppointment} appoinmentOpc={appoinmentOpc} />
      <div className='py-10 relative'>
        <div className='flex flex-col z-10 gap-4 mb-3 sm:flex-row md:flex-row lg:flex-row xl:flex-row lg:w-96 xl:w-96 lg:absolute xl:absolute lg:right-0 xl:right-0'>
          <input
            type='date'
            className='input-text'
            defaultValue={date}
            pattern='\d{4}-\d{2}-\d{2}'
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type='text'
            className='input-text'
            placeholder='Buscar'
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className=''>
          <DataTable
            title='Lista de postulantes'
            columns={columns}
            data={search(records)}
            pagination
            highlightOnHover
            progressPending={pending}
            progressComponent={<Spinner />}
            conditionalRowStyles={conditionalRowStyles}
          />
        </div>
      </div>
    </div>
  )
}
export default Record
