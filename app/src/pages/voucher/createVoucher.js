import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Spinner from '../../components/spinner'
import CreateVoucherForm from './createVoucherForm'
import { notificationError } from '../../notifications/notifications'
import { postRequest } from '../../services/services'

const CreateVoucher = () => {
  const [pending, setPending] = useState(true)
  const [token, setToken] = useState()
  const [reload, setReload] = useState()
  const [campus, setCampus] = useState()
  const [records, setRecords] = useState([])
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
  }, [token, reload])

  const showRecords = async () => {
    setPending(true)
    if (token) {
      const data = { campus, canceled: false, invoiced: false }
      await postRequest('records/voucher', data, token)
        .then(response => {
          setRecords(response)
          setPending(false)
        })
        .catch(error => {
          console.error(error)
          notificationError()
          setPending(false)
        })
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
