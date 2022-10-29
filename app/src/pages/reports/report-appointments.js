import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Spinner from '../../components/spinner'
import { postRequest } from '../../services/services'

const ReportAppointments = () => {
  const [dateStart, setDateStart] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [dateEnd, setDateEnd] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  // const [query, setQuery] = useState()
  const [appointments, setAppointments] = useState()
  const [pending, setPending] = useState()
  const [token, setToken] = useState('')
  const [campus, setCampus] = useState('')
  const [reload, setReload] = useState(false)

  /*   const search = data => {
    return data.filter(
      item => item.postulant.name.toLowerCase().includes(query) ||
      item.postulant.lastname.toLowerCase().includes(query) ||
      item.postulant.nrodoc.toLowerCase().includes(query) ||
      item.campus.toLowerCase().includes(query) ||
      item.typelic.toLowerCase().includes(query) ||
      item.typeproc.toLowerCase().includes(query)
    )
  } */

  const showAppointments = async () => {
    setPending(true)
    if (token) {
      const data = { dateStart, dateEnd, campus, confirmed: false, attended: false, canceled: false }
      await postRequest('appointment/bydate', data, token)
        .then(response => {
          setAppointments(response)
          setPending(false)
          console.log(response)
        })
    }
  }

  useEffect(() => {
    setReload(false)
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      showAppointments()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reload, dateEnd, dateStart])

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
      selector: row => row.canceled ? 'Cancelado' : '',
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
          />
        </div>
        <div className='py-28 md:py-14 lg:py-0'>
          <DataTable
            title='Lista de citas'
            columns={columns}
            data={(appointments)}
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

export default ReportAppointments
