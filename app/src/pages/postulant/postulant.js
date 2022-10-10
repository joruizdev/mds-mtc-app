/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getRequest } from '../../services/services'
import PostulantForm from './postulantForm'
import Spinner from '../../components/spinner'
import { messageAlert } from '../../notifications/notifications'

const Postulant = () => {
  const [pending, setPending] = useState(true)
  const [token, setToken] = useState(null)
  const [postulants, setPostulants] = useState([])
  const [reload, setReload] = useState(false)
  const [dataPostulant, setDataPostulant] = useState()

  const [query, setQuery] = useState('')

  const search = data => {
    return data.filter(
      item => item.name.toLowerCase().includes(query) ||
      item.lastname.toLowerCase().includes(query) ||
      item.nrodoc.toLowerCase().includes(query) ||
      item.typedoc.toLowerCase().includes(query)
    )
  }

  const reloadDataTable = () => {
    setReload(true)
  }

  const showPostulants = async () => {
    setPending(true)
    await getRequest('postulants')
      .then(response => {
        setPostulants(response)
        setPending(false)
      })
      .catch(e => {
        messageAlert('Ocurrió un error, por favor intentelo nuevamente en unos minutos', 'error')
        console.log(e)
      })
  }

  useEffect(() => {
    setReload(false)
    showPostulants()
  }, [reload])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
    }
  }, [token])

  const showEditPostulant = (e, row) => {
    e.preventDefault()
    setDataPostulant(row)
  }

  const columns = [
    {
      name: 'Apellidos y Nombres',
      selector: row => <span className='capitalize'>{String(row.name + ' ' + row.lastname).toLowerCase()}</span>,
      sortable: true
    },
    {
      name: 'Tipo de Documento',
      selector: row => row.typedoc,
      sortable: true
    },
    {
      name: 'Nro. de Documento',
      selector: row => row.nrodoc,
      sortable: true
    },
    {
      name: 'Accion',
      cell: row => <button className='px-4 py-2 bg-mds-yellow text-white rounded-md hover:bg-yellow-400' onClick={e => showEditPostulant(e, row)}>Editar</button>
    }
  ]

  return (
    <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
      <PostulantForm token={token} reload={reloadDataTable} data={dataPostulant} />
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
        <div className='z-0'>
          <DataTable
            title='Lista de postulantes'
            columns={columns}
            data={search(postulants)}
            pagination
            highlightOnHover
            progressPending={pending}
            progressComponent={<Spinner />}
          />
        </div>
      </div>
    </div>
  )
}

export default Postulant
