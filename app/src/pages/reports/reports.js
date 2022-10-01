import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
// import ExportToExcel from '../../components/exportToExcel'
import { postRequest } from '../../services/services'
const Reports = () => {
  const [token, setToken] = useState()
  const [reload, setReload] = useState()
  const [campus, setCampus] = useState()
  // eslint-disable-next-line no-unused-vars
  const [records, setRecords] = useState()
  const [dateStart, setDateStart] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [dateEnd, setDateEnd] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))

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
    if (token) {
      const data = { dateStart, dateEnd }
      const records = await postRequest('records/bydate', data, token)

      campus.toLowerCase() === 'todos'
        ? setRecords(records)
        : setRecords(records.filter(elem => elem.campus === campus))
    }
  }

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
      name: 'Observaciones',
      selector: row => row.observations
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
      {/* <ExportToExcel data={newDataExport} fileName='Lista de records' /> */}
      <div>
        <DataTable
          title='Lista de records'
          columns={columns}
          data={records}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  )
}
export default Reports
