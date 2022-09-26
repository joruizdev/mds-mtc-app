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
      text: '¿Esta seguro de cancelar el record del postulante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2c70b6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const data = {
          id: row.id,
          canceled: true
        }
        putRequest('records', data, token)
          .then(response => {
            console.log(response)
            setReload(true)
          })

        Swal.fire({
          text: 'El record fue candelado satisfactoriamente',
          icon: 'success',
          position: 'top-end',
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
  }, [token, reload])

  const showRecords = async () => {
    if (token) {
      const data = {
        dateStart: new Date().toLocaleDateString().split('/').reverse().join('-')
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
      selector: row => row.postulant.name + ' ' + row.postulant.lastname,
      sortable: true
    },
    {
      name: 'Tipo de Documento',
      selector: row => row.postulant.typedoc,
      sortable: true
    },
    {
      name: 'Nro. de Documento',
      selector: row => row.postulant.nrodoc,
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
        <div className='flex absolute right-0 z-10'>
          <div className=''>
            <div className='flex flex-col mb-3'>
              <input
                type='text'
                className='input-text'
                placeholder='Buscar'
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DataTable
          title='Lista de postulantes'
          columns={columns}
          data={search(records)}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  )
}
export default Record
