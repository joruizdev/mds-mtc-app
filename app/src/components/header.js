import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../aseets/logo.png'
import Nav from '../components/nav'
import Time from './time'
import user from '../aseets/user.svg'
import calendar from '../aseets/calendar.svg'
import clock from '../aseets/clock.svg'
import company from '../aseets/company.svg'
import getOut from '../aseets/get-off-bus.svg'
import ImgMenu from '../aseets/menu.png'

const Header = () => {
  const [username, setUsername] = useState()
  const [campus, setCampus] = useState()
  const [typeUser, setTypeUser] = useState('')
  const menu = useRef()

  const navigate = useNavigate()

  const handleLogout = () => {
    console.log('cerrar session')
    window.localStorage.removeItem('loggedSystemAppUser')
    navigate('/')
    window.location.reload()
  }
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUsername(user.username)
      setCampus(user.campus)
      setTypeUser(user.typeuser)
    }
  }, [username])

  const showMenu = () => {
    const menuNav = menu.current
    menuNav.classList.toggle('hidden')
  }

  return (
    <>
      <header className='container mx-auto flex px-5 justify-between py-4 lg:px-0 lx:px-0'>
        <div className='flex flex-col gap-5 lg:flex lg:flex-row lg:gap-10 lg:justify-center lg:items-center xl:flex xl:flex-row xl:gap-10 xl:justify-center xl:items-center'>
          <div className='w-28'>
            <img src={logo} alt='logo' />
          </div>
          <div ref={menu} className='hidden lg:block xl:block'>
            <Nav typeuser={typeUser} />
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <div className='hidden lg:flex lg:justify-center lg:items-center lg:gap-5 px-5'>
            <div className='flex gap-2'>
              <img src={calendar} alt='Date' className='w-5' />
              <span className=''>{new Date().toLocaleDateString()}</span>
            </div>
            <div className='flex gap-2'>
              <img src={clock} alt='Clock' className='w-5' />
              <span className=''><Time /></span>
            </div>
            <div className='flex gap-2'>
              <img src={company} alt='Company' className='w-5' />
              <span className=''>{campus}</span>
            </div>
            <div className='flex gap-2'>
              <img src={user} alt='Username' className='w-5' />
              <span className=''>{username}</span>
            </div>
            <button onClick={handleLogout} className='flex gap-2 rounded-md px-2 py-1 bg-mds-yellow hover:bg-yellow-400'>
              <img src={getOut} alt='Username' className='w-5' />
              Salir
            </button>
          </div>
        </div>

        <button onClick={showMenu} className='flex flex-col gap-1 pt-2 items-start text-xl align-top lg:hidden xl:hidden'>
          <img src={ImgMenu} alt='Menu' />
        </button>

      </header>
    </>
  )
}

export default Header
