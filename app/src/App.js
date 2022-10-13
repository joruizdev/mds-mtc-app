/* eslint-disable react/jsx-indent */
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/header'
import Home from './pages/home'
import Postulant from './pages/postulant/postulant'
import Login from './pages/login/login'
import Record from './pages/record/record'
import User from './pages/user/user'
import Reports from './pages/reports/reports'
import Voucher from './pages/voucher/createVoucher'

const App = () => {
  const [user, setUser] = useState(null)
  const [reload, setReload] = useState(false)

  const loadUser = () => {
    setReload(true)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSystemAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
    setReload(false)
  }, [reload])

  return (
    <>{
      user === null
        ? <Login click={loadUser} />
        : <>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/postulant' element={<Postulant />} />
            <Route path='/record' element={<Record />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/voucher' element={<Voucher />} />
            <Route path='/user' element={<User />} />
            <Route path='*'>No found</Route>
          </Routes>
          </>
      }
    </>
  )
}

export default App
