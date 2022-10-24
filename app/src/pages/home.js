/* eslint-disable react/jsx-indent */
import Stopwatch from '../components/stopwatch'
import { postRequest } from '../services/services'
import { useState, useEffect } from 'react'
import imgNoFound from '../aseets/no-found.webp'
import Spinner from '../components/spinner'
import { notificationError } from '../notifications/notifications'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [stopwatch, setStopwatch] = useState([])
  const [reload, setReload] = useState(true)
  const [token, setToken] = useState(null)
  const [campus, setCampus] = useState('')
  const [campusUser, setCampusUser] = useState('')
  const [typeUser, setTypeUser] = useState('')
  const [counter, setCounter] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [pending, setPending] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setToken(user.token)
      setCampus(user.campus)
      setCampusUser(user.campus)
      setTypeUser(user.typeuser)
    }
  }, [token])

  useEffect(() => {
    setReload(false)
    loadRecords()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, date, campus])

  const loadData = () => {
    setReload(true)
  }

  const loadRecords = async () => {
    setPending(true)
    const newDate = counter === 0 ? new Date().toLocaleDateString().split('/').reverse().join('-') : date
    if (token) {
      const data = {
        dateStart: newDate,
        dateEnd: newDate,
        campus,
        canceled: false
      }

      await postRequest('records/bydate', data, token)
        .then(records => {
          setStopwatch(records)
          setCounter(counter + 1)
          setPending(false)
        })
        .catch((e) => {
          console.log(e)
          if (e.response.data.error === 'token expired') return navigate('/session-expired')
          notificationError()
        })
    }
  }

  return (
    <>
      <div className='flex flex-col mb-5 px-5 gap-5 lg:px-0 lg:flex-row container mx-auto'>
        <div className='flex flex-col'>
          <span className='text-sm font-medium text-gray-700'>
            Fecha
          </span>
          <input
            type='date'
            className='input-date w-full lg:w-80'
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          {
            campusUser.toLowerCase() === 'todos'
              ? <>
                  <span className='text-sm font-medium text-gray-700'>Local</span>
                  <select
                    className='input-select lg:w-80'
                    onChange={(e) => setCampus(e.target.value)}
                  >
                    <option value='Todos'>Todos</option>
                    <option value='Surquillo'>Surquillo</option>
                    <option value='Villa El Salvador'>Villa El Salvador</option>
                    <option value='Huancayo'>Huancayo</option>
                  </select>
                </>
              : ''
          }
        </div>
      </div>
      {
        !pending
          ? <div className='container mx-auto'>
              <section className='grid grid-cols-1 gap-4  px-4 lg:grid-cols-3 xl:grid-cols-4 lg:px-0 xl:px-0'>
                {stopwatch.map((data) => (
                  <Stopwatch key={data.id} {...data} typeuser={typeUser} token={token} click={loadData} />
                ))}
              </section>
            </div>
          : <div className='flex h-screen m-auto'><Spinner /></div>
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
