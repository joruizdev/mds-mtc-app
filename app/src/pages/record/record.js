import { postRequest, putRequest } from '../../services/services'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import RecordForm from './recordForm'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Record = () => {
  const [token, setToken] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [typeUer, setTypeUer] = useState('')
  const [campus, setCampus] = useState('')
  const [records, setRecords] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [reload, setReload] = useState(false)

  const [query, setQuery] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [count, setCount] = useState(0)

  // eslint-disable-next-line no-unused-vars
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
            setReload(true)
          })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          text: 'Se canceló la atención satisfactoriamente',
          showConfirmButton: false,
          timer: 1500
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reload, date])

  const showRecords = async () => {
    setCount(count + 1)
    if (token) {
      const newDate = count === 1
        ? new Date().toLocaleDateString().split('/').reverse().join('-')
        : date
      const data = {
        dateStart: newDate,
        dateEnd: newDate
      }

      const records = await postRequest('records/bydate', data, token)

      campus.toLowerCase() === 'todos'
        ? setRecords(records)
        : setRecords(records.filter(elem => elem.campus === campus))
    }
  }

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

  return (
    <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
      <RecordForm token={token} records={records} campus={campus} />
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
          />
        </div>
      </div>
    </div>
  )
}
export default Record
