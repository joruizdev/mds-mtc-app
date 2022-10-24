import { useNavigate } from 'react-router-dom'
const SessionExpired = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    console.log('cerrar session')
    window.localStorage.removeItem('loggedSystemAppUser')
    navigate('/')
    window.location.reload()
  }

  return (
    <div className='fixed left-0 top-0 w-full h-screen z-50 bg-white rounded-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='container mx-auto '>
          <div className='flex flex-col'>
            <header className='flex justify-center'>
              <h1 className='text-5xl font-extrabold text-mds-blue'>Su sesión ha expirado</h1>
            </header>
            <div className='text-center p-10'>
              <p className=''>Por favor inicia sesión nuevamente para continuar</p>
            </div>
            <footer className='text-center'>
              <button className='btn-blue-dark' onClick={handleLogout}>Iniciar sesión</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionExpired
