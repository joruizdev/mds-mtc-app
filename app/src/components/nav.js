/* eslint-disable react/jsx-closing-tag-location */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Nav = ({ typeuser, click }) => {
  const navigate = useNavigate()
  const menu = useRef()

  const handleLogout = () => {
    console.log('cerrar session')
    window.localStorage.removeItem('loggedSystemAppUser')
    navigate('/')
    window.location.reload()
  }

  const showMenu = () => {
    click()
  }

  return (
    <nav ref={menu} className='font-medium flex flex-col fixed top-0 left-0 bg-white  text-mds-blue w-full h-screen z-40 space-y-14 overflow-hidden lg:bg-transparent lg:flex-row lg:relative lg:h-auto lg:space-y-0 lg:text-stone-900'>
      <div className='flex justify-end py-10 px-14 relative lg:hidden'>
        <button onClick={showMenu}>
          <span className='w-8 h-1 bg-mds-blue rounded-xl absolute -rotate-45' />
          <span className='w-8 h-1 bg-mds-blue rounded-xl absolute rotate-45' />
        </button>
      </div>
      <div className='flex flex-col lg:flex-row gap-2 lg:gap-1'>
        <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/'>Inicio</Link></div>
        {
          typeuser.toLowerCase() === 'otros'
            ? ''
            : <>
              <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/postulant'>Postulante</Link></div>
              <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/record'>Record</Link></div>
              <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/appointment'>Citas</Link></div>
              <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/menu-reports'>Reportes</Link></div>
              {/* <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/reports'>Reportes</Link></div> */}
              {/*  <div onClick={showMenu} className='hidden text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2'><Link to='/voucher'>Voucher</Link></div> */}
            </>
        }
        {
          typeuser.toLowerCase() === 'soporte' && <div onClick={showMenu} className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:py-2 '><Link to='/user'>Usuario</Link></div>
        }
        <div className='text-md px-2 rounded-md hover:text-stone-800 hover:bg-stone-300 cursor-pointer mx-auto text-center py-5 lg:hidden'><button onClick={handleLogout}>Cerrar sesión</button></div>
      </div>
    </nav>
  )
}

export default Nav
