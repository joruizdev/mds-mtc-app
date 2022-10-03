/* eslint-disable react/jsx-indent */
import Stopwatch from '../components/stopwatch'
import { postRequest } from '../services/services'
import { useState, useEffect } from 'react'
import imgNoFound from '../aseets/no-found.webp'

const Home = () => {
  const [stopwatch, setStopwatch] = useState([])
  const [reload, setReload] = useState(true)
  const [token, setToken] = useState(null)
  const [campus, setCampus] = useState('')
  const [typeUser, setTypeUser] = useState('')
  const [counter, setCounter] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      setTypeUser(user.typeuser)
    }
  }, [token])

  useEffect(() => {
    setReload(false)
    loadRecords()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, date])

  const loadData = () => {
    setReload(true)
  }

  const loadRecords = async () => {
    // const date = new Date().toLocaleDateString().split('/').reverse().join('-')
    // const dateStart = counter === 0 ? date : txtDate.current.value
    const newDate = counter === 0 ? new Date().toLocaleDateString().split('/').reverse().join('-') : date
    if (token) {
      const data = {
        dateStart: newDate,
        dateEnd: newDate
      }

      const records = await postRequest('records/bydate', data, token)
      campus.toLowerCase() === 'todos'
        ? setStopwatch(records.filter(elem => elem.canceled === false))
        : setStopwatch(records.filter(elem => elem.canceled === false && elem.campus === campus))
      setCounter(counter + 1)
    }
  }

  /* const handleSeacrh = async () => {
    loadRecords()
  } */

  return (
    <>
      {
        stopwatch
          ? (
            <>
              <div className='container mx-auto'>
                <div className='flex flex-col mb-5 px-5 lg:w-80 lg:px-0'>
                  <span className='text-sm font-medium text-gray-700'>
                    Fecha
                  </span>
                  <input
                    type='date'
                    className='input-text w-full'
                    defaultValue={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className='grid grid-cols-12 gap-5'>
                  <div className='col-span-12 px-5 md:col-span-6 md:px-5 lg:col-span-4 lg:px-0 xl:col-span-3 xl:px-0'>
                    <></>
                  </div>
                </div>
                <section className='grid grid-cols-1 gap-4  px-4 lg:grid-cols-3 xl:grid-cols-4 lg:px-0 xl:px-0'>
                  {stopwatch.map((data) => (
                    <Stopwatch key={data.id} {...data} typeuser={typeUser} token={token} click={loadData} />
                  ))}
                </section>
              </div>
            </>
            )
          : <>
            <div className='flex h-screen'>
              <div className='spinner m-auto' />
            </div>
            </>
      }
      {
        stopwatch.length === 0
          ? <div className='container mx-auto flex flex-col items-center justify-center w-full pt-32'>
              <div className='items-center text-5xl font-regular text-gray-400 text-center'>
                <p>No hay resultados</p>
              </div>
              <img src={imgNoFound} alt='No found' className='py-10 w-60' />
            </div>
          : ''
      }
    </>
  )
}

export default Home
