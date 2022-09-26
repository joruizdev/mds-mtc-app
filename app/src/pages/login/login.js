/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { postRequestLogin } from '../../services/services'
import imgLogo from '../../aseets/logo.png'
import { useForm } from 'react-hook-form'

const Login = ({ click }) => {
  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors }
  } = useForm()

  const [errorMessage, setErrorMessage] = useState()
  const [user, setUser] = useState(null)

  const onSubmit = async (data) => {
    const user = await postRequestLogin('login',
      {
        username: data.username,
        password: data.password
      })

    if (user.error) {
      setErrorMessage(user.error)
    } else {
      setUser(user)

      window.localStorage.setItem(
        'loggedSystemAppUser', JSON.stringify(user)
      )
      resetField('username')
      resetField('password')
      click()
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-10 justify-center items-center bg-white p-10 rounded-lg shadow-md lg:flex-row'>
          <div className='w-72 md:w-96 mb-5'>
            <img src={imgLogo} alt='logo' />
          </div>
          <div className='w-full lg:w-96'>
            <div className='flex flex-col mb-3'>
              <input
                type='text'
                placeholder='Usuario'
                className='mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 placeholder:italic focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-lg focus:ring-1'
                {...register('username', {
                  required: true
                })}
              />
              {errors?.username?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
            <div className='flex flex-col mb-10'>
              <input
                type='password'
                placeholder='Contraseña'
                className='mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 placeholder:italic focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-lg focus:ring-1'
                {...register('password', {
                  required: true
                })}
              />
              {errors?.password?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
              {errorMessage ? <p className='text-red-500 text-sm pt-2'>Usuario o password invalido</p> : ''}
            </div>
            <button
              type='submit'
              className='px-5 py-2 bg-mds-blue text-white rounded-md hover:bg-mds-blue-dark text-lg w-full'
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
