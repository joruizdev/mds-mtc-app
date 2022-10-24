import { useNavigate } from 'react-router-dom'
const NotificationExpiredToken = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    console.log('cerrar session')
    window.localStorage.removeItem('loggedSystemAppUser')
    navigate('/')
    window.location.reload()
  }
  return (
    <div className='fixed z-50 top-0 left-0 w-full h-screen bg-stone-500 bg-opacity-60'>
      <div className='container mx-auto flex justify-center items-center h-full'>
        <div className='container mx-auto'>
          <div className='bg-white text-center rounded-md flex flex-col justify-center items-center gap-4 p-6'>
            <h1 className='text-3xl font-mont font-semibold text-stone-800'>Sesión expirada</h1>
            <p>Su sesión ha expirado, por favor unicia sessión nuevamente</p>
            <button className='btn-blue-dark' onClick={handleLogout}>Iniciar sesión</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationExpiredToken
