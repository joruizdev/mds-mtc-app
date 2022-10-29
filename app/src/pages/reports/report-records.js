import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ExportToExcel from '../../components/exportToExcel'
import { postRequest } from '../../services/services'
import Spinner from '../../components/spinner'
import { notificationError } from '../../notifications/notifications'
import { useNavigate } from 'react-router-dom'

const ReportRecords = () => {
  const [pending, setPending] = useState(true)
  const [token, setToken] = useState()
  const [reload, setReload] = useState()
  const [campus, setCampus] = useState()
  const [records, setRecords] = useState([])
  const [dateStart, setDateStart] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [dateEnd, setDateEnd] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [newRecords, setNewRecords] = useState([])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [totalInitiated, setTotalInitiated] = useState()
  const [recordsAttended, setRecordsAttended] = useState([])
  const [recordsClosed, setRecordsClosed] = useState([])
  const [recordsCanceled, setRecordsCanceled] = useState([])
  const [recordsNotInitiated, setRecordsNotInitiated] = useState([])

  // eslint-disable-next-line no-unused-vars
  const search = data => {
    return data.filter(
      item => item.postulant.name.toLowerCase().includes(query) ||
      item.postulant.lastname.toLowerCase().includes(query) ||
      item.postulant.nrodoc.toLowerCase().includes(query) ||
      item.campus.toLowerCase().includes(query) ||
      item.typelic.toLowerCase().includes(query) ||
      item.typeproc.toLowerCase().includes(query)
    )
  }

  useEffect(() => {
    setReload(false)
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      showRecords()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reload, dateEnd, dateStart])

  const showRecords = async () => {
    setPending(true)
    if (token) {
      const data = { dateStart, dateEnd, campus }
      await postRequest('records/bydate', data, token)
        .then(response => {
          setRecords(response)
          setNewRecords([])
          setPending(false)
          // eslint-disable-next-line array-callback-return
          response.map(elem => {
            const record = {
              Postulante: elem.postulant.lastname + ' ' + elem.postulant.name,
              TipoDoc: elem.postulant.typedoc,
              NroDoc: elem.postulant.nrodoc,
              Fecha: new Date(elem.date).toLocaleDateString(),
              Local: elem.campus,
              NroOrden: elem.order,
              TipoLic: elem.typelic,
              TipoProc: elem.typeproc,
              HoraInicio: elem.timestart !== null ? new Date(elem.timestart).toLocaleTimeString() : '--',
              HoraFinal: elem.timeend !== null ? new Date(elem.timeend).toLocaleTimeString() : '--',
              HoraCierre: elem.timeclose !== null ? new Date(elem.timeclose).toLocaleTimeString() : '--',
              CostoExamen: elem.price,
              Estado: (elem.canceled) ? 'Cancelado' : (elem.closed) ? 'Cerrado' : (elem.initiated) ? 'Iniciado' : 'No iniciado'
            }
            setNewRecords(newRecords => newRecords.concat(record))
          })

          /* const sumall = newRecords.map(item => item.CostoExamen).reduce((prev, curr) => prev + curr, 0)
          const dt = { Postulante: '', TipoDoc: '', NroDoc: '', Fecha: '', Local: '', NroOrden: '', TipoLic: '', TipoProc: '', HoraInicio: '', HoraFinal: '', HoraCierre: 'Total', CostoExamen: sumall, Estado: '' }
          console.log(datarecord.concat(newRecords, dt)) */
          // setNewRecords(item => item.concat(dt))
          // footerInfo()
        }).catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return navigate('/session-expired')
          notificationError()
        })
    }
  }

  useEffect(() => {
    setRecordsAttended(records.filter(item => item.initiated && !item.closed && !item.canceled))
    setRecordsClosed(records.filter(item => item.closed))
    setRecordsCanceled(records.filter(item => item.canceled))
    setRecordsNotInitiated(records.filter(item => !item.initiated))
    setTotalInitiated(records.map(item => item.price).reduce((prev, curr) => prev + curr, 0))
    if (newRecords.length > 0) {
      const addRowRecords = { Postulante: '', TipoDoc: '', NroDoc: '', Fecha: '', Local: '', NroOrden: '', TipoLic: '', TipoProc: '', HoraInicio: '', HoraFinal: '', HoraCierre: 'Total', CostoExamen: totalInitiated, Estado: '' }
      setNewRecords(newRecords.concat(addRowRecords))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, totalInitiated])

  const columns = [
    {
      name: 'Fecha',
      selector: row => String(new Date(row.date).toISOString().split('T')[0]).split('-').reverse().join('/'),
      sortable: true
    },
    {
      name: 'Local',
      selector: row => row.campus,
      sortable: true
    },
    {
      name: 'Apellidos y Nombres',
      selector: row => <span className='capitalize'>{String(row.postulant.name + ' ' + row.postulant.lastname).toLowerCase()}</span>,
      sortable: true,
      wrap: true
    },
    {
      name: 'Tipo de doc.',
      selector: row => row.postulant.typedoc,
      sortable: true
    },
    {
      name: 'Nro. de Doc.',
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
      sortable: true,
      wrap: true
    },
    {
      name: 'Costo',
      selector: row => row.price,
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
      name: 'Motivo de cancelación',
      selector: row => row.reason,
      wrap: true
    },
    {
      name: 'Observaciones',
      selector: row => row.observations,
      wrap: true
    }
  ]

  const conditionalRowStyles = [
    {
      when: row => row.canceled === true,
      style: {
        color: 'red'
      }
    }
  ]

  return (
    <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
      <div className='grid grid-cols-12 gap-5 py-5'>
        <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
          <div className='flex flex-col mb-3'>
            <span className='text-sm font-medium text-gray-700'>
              Fecha inicio
            </span>
            <input
              type='date'
              className='input-text'
              defaultValue={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
        </div>
        <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
          <div className='flex flex-col mb-3'>
            <span className='text-sm font-medium text-gray-700'>
              Fecha final
            </span>
            <input
              type='date'
              className='input-text'
              defaultValue={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='relative col-span-12'>
        <div className='flex flex-col gap-5 absolute z-10 w-full md:flex-row lg:w-96 lg:right-0'>
          <input
            type='text'
            className='input-text w-full'
            placeholder='Buscar'
            onChange={(e) => setQuery(e.target.value)}
          />
          <ExportToExcel data={newRecords} fileName='Lista de records' />
        </div>
        <div className='py-28 md:py-14 lg:py-0'>
          <DataTable
            title='Lista de records'
            columns={columns}
            data={search(records)}
            pagination
            highlightOnHover
            progressPending={pending}
            progressComponent={<Spinner />}
            conditionalRowStyles={conditionalRowStyles}
          />
          <div>
            <div className='flex gap-10'>
              <p>{`En espera: ${recordsNotInitiated.length}`}</p>
              <p>{`En proceso: ${recordsAttended.length}`}</p>
              <p>{`Terminado: ${recordsClosed.length}`}</p>
              <p>{`Cancelados: ${recordsCanceled.length}`}</p>
              <p>{`Total de ingresos = S/. ${totalInitiated}.00`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ReportRecords
