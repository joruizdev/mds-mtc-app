import { useEffect, useState } from 'react'
import Datatable from 'react-data-table-component'
import Spinner from '../../components/spinner'
import { getRequest } from '../../services/services'
import ExpandCollection from './expandCollection'

const Collection = () => {
  const [collections, setCollections] = useState([])
  const [token, setToken] = useState(null)
  const [typeUer, setTypeUer] = useState('')
  const [campus, setCampus] = useState('')
  const [reload, setReload] = useState(false)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    setReload(false)
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      setTypeUer(user.typeuser)
      showCollections()
      console.log(campus)
      console.log(typeUer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reload])

  const showCollections = () => {
    setPending(true)
    getRequest('attention-detail')
      .then(response => {
        console.log(response)
        setCollections(response)
        setPending(false)
      })
  }
  const columns = [
    {
      name: 'Fecha',
      selector: row => String(new Date(row.date).toISOString().split('T')[0]).split('-').reverse().join('/'),
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
      selector: row => row.appointment.typelic,
      sortable: true
    },
    {
      name: 'Tipo de proc.',
      selector: row => row.appointment.typeproc,
      sortable: true
    },
    {
      name: 'Fecha de cita',
      selector: row => String(new Date(row.appointment.date).toISOString().split('T')[0]).split('-').reverse().join('/'),
      sortable: true
    },
    {
      name: '¿Pagado?',
      selector: row => (row.paid) ? 'Pagado' : 'Pendiente',
      sortable: true
    },
    {
      name: 'Estado',
      selector: row => row.paymentstatus,
      sortable: true
    }
  ]
  return (
    <div className='container mx-auto shadow-sm p-5 bg-white rounded-lg'>
      <></>
      <div className=''>
        <Datatable
          title='Lista de cobranzas'
          columns={columns}
          data={collections}
          pagination
          highlightOnHover
          progressPending={pending}
          progressComponent={<Spinner />}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandCollection}
        />
      </div>
    </div>
  )
}

export default Collection
