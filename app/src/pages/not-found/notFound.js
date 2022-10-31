import { useNavigate } from 'react-router-dom'
const NotFound = () => {
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
    window.location.reload()
  }
  return (
    <div className='fixed left-0 top-0 w-full h-screen z-50 bg-white rounded-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='container mx-auto '>
          <div className='flex flex-col'>
            <header className='flex justify-center'>
              <h1 className='text-9xl font-extrabold text-mds-blue'>404</h1>
            </header>
            <div className='text-center p-10'>
              <p className=''>Lo siento :( página no encontrada</p>
            </div>
            <footer className='text-center'>
              <button className='btn-blue-dark' onClick={handleHome}>Regresar al inicio</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
