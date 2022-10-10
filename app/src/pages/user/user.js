/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getRequest } from '../../services/services'
import UserForm from './userForm'
import Spinner from '../../components/spinner'
import { messageAlert } from '../../notifications/notifications'

const User = () => {
  const [token, setToken] = useState(null)
  const [users, setUsers] = useState([])
  const [reload, setReload] = useState(false)
  const [dataUser, setDataUser] = useState()
  const [pending, setPending] = useState(true)

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

  const showUsers = async () => {
    setPending(true)
    await getRequest('users')
      .then(response => {
        setUsers(response)
        setPending(false)
      })
      .catch(e => {
        console.log(e)
        messageAlert('Ocurrio un error, por favor intente nuevamente en unos minutos', 'error')
      })
  }

  useEffect(() => {
    setReload(false)
    showUsers()
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
    setDataUser(row)
  }

  const columns = [
    {
      name: 'Apellidos y Nombres',
      selector: row => row.name + ' ' + row.lastname,
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
      <UserForm token={token} reload={reloadDataTable} data={dataUser} />
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
            title='Lista de usuarios'
            columns={columns}
            data={search(users)}
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

export default User
