import { Link } from 'react-router-dom'

const Cards = ({ data }) => {
  return (
    <Link to={data.link}>
      <article className='relative flex flex-col text-sm leading-6 bg-white py-10 px-4 rounded-lg shadow-lg border-stone-100 border-2 hover:border-mds-yellow hover:border-2'>
        <div className='pb-10'>
          <h1 className='text-2xl text-center'>{data.title}</h1>
        </div>
        <div className='flex justify-center'>
          <div className='w-20'>
            <img className='w-full' src={data.img} alt={data.title} />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default Cards
