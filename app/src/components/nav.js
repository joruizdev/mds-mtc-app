import { Link } from 'react-router-dom'

const Nav = ({ typeuser }) => {
  return (
    <nav>
      <ul className='font-medium flex flex-col gap-2 lg:flex lg:flex-row lg:gap-4'>
        <li className='text-md hover:text-mds-blue cursor-pointer'><Link to='/'>Inicio</Link></li>
        <li className='text-md hover:text-mds-blue cursor-pointer'><Link to='/postulant'>Postulante</Link></li>
        <li className='text-md hover:text-mds-blue cursor-pointer'><Link to='/record'>Record</Link></li>
        {
          typeuser.toLowerCase() === 'soporte' && <li className='text-md hover:text-mds-blue cursor-pointer'><Link to='/user'>Usuario</Link></li>
        }
      </ul>
    </nav>
  )
}

export default Nav
