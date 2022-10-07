import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { postRequest } from '../../services/services'
import Spinner from '../../components/spinner'
import CreateVoucherForm from './createVoucherForm'

const CreateVoucher = () => {
  const [pending, setPending] = useState(true)
  const [token, setToken] = useState()
  const [reload, setReload] = useState()
  const [campus, setCampus] = useState()
  const [records, setRecords] = useState([])
  const [dateStart, setDateStart] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [dateEnd, setDateEnd] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [newRecords, setNewRecords] = useState([])
  const [query, setQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])

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
      const data = { dateStart, dateEnd }
      const dataRecords = await postRequest('records/bydate', data, token)

      campus.toLowerCase() === 'todos'
        ? setRecords(dataRecords)
        : setRecords(dataRecords.filter(elem => elem.campus === campus))
      setNewRecords([])
      setPending(false)
      // eslint-disable-next-line array-callback-return
      dataRecords.map(elem => {
        const record = {
          Postulante: elem.postulant.lastname + ' ' + elem.postulant.name,
          TipoDoc: elem.postulant.typedoc,
          NroDoc: elem.postulant.nrodoc,
          Fecha: new Date(elem.date).toLocaleDateString(),
          Local: elem.campus,
          NroOrden: elem.order,
          TipoLic: elem.typelic,
          TipoProc: elem.typeproc
        }
        setNewRecords(newRecords => newRecords.concat(record))
      })

      campus.toLowerCase() !== 'todos' && setNewRecords(newRecords.filter(elem => elem.campus === campus))
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
      sortable: true
    }
  ]

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows)
  }, [])

  return (
    <>
      <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
        <div className='grid grid-cols-12 gap-5 py-5 hidden'>
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
              className='input-text w-full hidden'
              placeholder='Buscar'
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='py-28 md:py-14 lg:py-0'>
            <DataTable
              title='Atenciones por facturar'
              columns={columns}
              data={search(records)}
              pagination
              highlightOnHover
              progressPending={pending}
              progressComponent={<Spinner />}
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              paginationPerPage={5}
              dense
            />
          </div>
        </div>
      </div>
      {
        selectedRows.length > 0 ? <CreateVoucherForm rows={selectedRows} /> : ''
      }
    </>
  )
}
export default CreateVoucher
