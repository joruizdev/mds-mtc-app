import { menu } from './resources'
import Cards from '../../../components/cards'

const MenuReports = () => {
  return (
    <div className='container mx-auto p-5  rounded-lg'>
      <section className='grid grid-cols-1 gap-4  px-4 lg:grid-cols-3 xl:grid-cols-4 lg:px-0 xl:px-0'>
        {menu.map((data) => (<Cards key={data.title} data={data} />))}
      </section>
    </div>
  )
}

export default MenuReports
