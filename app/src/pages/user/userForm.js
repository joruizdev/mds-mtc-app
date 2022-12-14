import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { postRequest, putRequest, putRequestChangePassword } from '../../services/services'
import { notificationError, notificationSuccess } from '../../notifications/notifications'
import { useNavigate } from 'react-router-dom'

const UserForm = ({ token, reload, data }) => {
  const [titleForm, setTitleForm] = useState('Registrar nuevo usuario')
  const [firstLoad, setFirstLoad] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [textButtonSave, setTextButtonSave] = useState('Guardar')
  const [textButtonChangePassword, setTextButtonChangePassword] = useState('Cambiar password')
  const [textButtonUpdate, setTextButtonUpdate] = useState('Actualizar')
  const txtPassword = useRef()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0',
      typedoc: 'DNI',
      gender: 'Masculino'
    }
  })

  useEffect(() => {
    if (firstLoad) {
      showEditUser()
    }
    setFirstLoad(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const showEditUser = () => {
    setTitleForm('Actualizar datos de usuario')
    setValue('id', data.id)
    setValue('name', data.name)
    setValue('lastname', data.lastname)
    setValue('typedoc', data.typedoc)
    setValue('nrodoc', data.nrodoc)
    setValue('gender', data.gender)
    setValue('telephone', data.telephone)
    setValue('campus', data.campus)
    setValue('typeuser', data.typeuser)
    setValue('username', data.username)
    setValue('adress', data.adress)
    setValue('password', 'medicossalud')
    setValue('active', data.active)
    setChangePassword(true)
  }

  const onSubmit = data => {
    // console.log(data)
    titleForm === 'Registrar nuevo usuario' ? save(data) : update(data)
  }

  const save = async (data) => {
    setTextButtonSave('Verificando...')
    const newData = { ...data, records: [], postulants: [] }
    const result = await postRequest('users/bynrodoc', newData, token)
    if (result.length > 0) return notificationError('Ya existe un usuario con el nro de documento ingresado')
    setTextButtonSave('Guardando...')
    await postRequest('users', data, token)
      .then(data => {
        console.log(data)
        reload()
        handleCancel()
        notificationSuccess('Registro guardado satisfactoriamente')
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
      })
    setTextButtonSave('Guardar')
  }

  const update = async (data) => {
    setTextButtonUpdate('Actualizando')
    await putRequest('users', data, token)
      .then(response => {
        notificationSuccess('Registro actualizado satisfactoriamente')
        handleCancel()
        reload()
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
      })
    setTextButtonUpdate('Actualizar')
  }

  const handleCancel = () => {
    setTitleForm('Registrar nuevo usuario')
    resetField('id')
    resetField('name')
    resetField('lastname')
    resetField('typedoc')
    resetField('nrodoc')
    resetField('gender')
    resetField('telephone')
    resetField('campus')
    resetField('typeuser')
    resetField('username')
    resetField('adress')
    resetField('password')
    resetField('active')
    data = []
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setTextButtonChangePassword('Cambiando password')
    const data = {
      password: getValues('password'),
      id: getValues('id')
    }

    if (changePassword) {
      await putRequestChangePassword('users/changepassword', data, token)
        .then(response => {
          notificationSuccess('Password actualizado satisfactoriamente')
          reload()
          handleCancel()
        })
        .catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return navigate('/session-expired')
          notificationError()
        })
    }
  }

  return (
    <div>
      <div>
        <h1 className='text-xl pb-5'>{titleForm}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-12 gap-5'>
          <input
            type='hidden'
            {...register('id')}
          />

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Nombres
              </span>
              <input
                type='text'
                className='input-text'
                {...register('name', {
                  required: true
                })}
              />
              {errors?.name?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Apellidos
              </span>
              <input
                type='text'
                className='input-text'
                {...register('lastname', {
                  required: true
                })}
              />
              {errors?.lastname?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Tipo de documento
              </span>
              <select
                className='input-select'
                {...register('typedoc', {
                  required: true
                })}
              >
                <option value='DNI'>DNI</option>
                <option value='CE'>CE</option>
                <option value='Pasaporte'>Pasaporte</option>
                <option value='PTP'>PTP</option>
              </select>
              {errors?.typedoc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                NroDoc
              </span>
              <input
                type='text'
                className='input-text'
                {...register('nrodoc', {
                  required: true
                })}
              />
              {errors?.nrodoc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
              {errors?.nrodoc?.type === 'valueAsNumber' && <p className='text-red-500 text-sm'>Solo se aceptan n??meros</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                G??nero
              </span>
              <select
                className='input-select'
                {...register('gender', {
                  required: true
                })}
              >
                <option value='Masculino'>Masculino</option>
                <option value='Femenino'>Femenino</option>
              </select>
              {errors?.gender?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Tel??fono
              </span>
              <input
                type='text'
                className='input-text'
                {...register('telephone', {
                  required: true,
                  valueAsNumber: true
                })}
              />
              {errors?.telephone?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
              {errors?.telephone?.type === 'valueAsNumber' && <p className='text-red-500 text-sm'>Solo se aceptan n??meros</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Local
              </span>
              <select
                className='input-select'
                {...register('campus', {
                  required: true
                })}
              >
                <option value='Surquillo'>Surquillo</option>
                <option value='Villa El Salvador'>Villa El Salvador</option>
                <option value='Huancayo'>Huancayo</option>
                <option value='Encalada'>Encalada</option>
                <option value='Todos'>Todos</option>
              </select>
              {errors?.campus?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Estado
              </span>
              <select
                className='input-select'
                {...register('active', {
                  required: true
                })}
              >
                <option value='true'>Activo</option>
                <option value='false'>Inactivo</option>
              </select>
              {errors?.active?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Tipo de usuario
              </span>
              <select
                className='input-select'
                {...register('typeuser', {
                  required: true
                })}
              >
                <option value='Soporte'>Soporte</option>
                <option value='Admisi??n'>Admisi??n</option>
                <option value='Director'>Director</option>
                <option value='Otros'>Otros</option>
              </select>
              {errors?.typeuser?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Nombre de usuario
              </span>
              <input
                type='text'
                className='input-text lowercase'
                {...register('username', {
                  required: true
                })}
              />
              {errors?.username?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Password
              </span>
              <input
                ref={txtPassword}
                type='password'
                className='input-text lowercase'
                {...register('password', {
                  required: true
                })}
              />
              {errors?.password?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 self-end'>
            <div className='flex flex-col mb-4'>
              <button className='btn-blue-dark' onClick={handleChangePassword}>{textButtonChangePassword}</button>
            </div>
          </div>

          <div className='col-span-12'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Direcci??n
              </span>
              <input
                type='text'
                className='input-text'
                {...register('adress', {
                  required: true
                })}
              />
              {errors?.adress?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>
        </div>
        <div className='flex flex-col pt-5 gap-4 w-full md:flex-row lg:w-80'>
          <button
            type='button'
            className='btn-red-light w-full'
            onClick={handleCancel}
          >
            Cancelar
          </button>
          {
            titleForm === 'Registrar nuevo usuario'
              ? <input type='submit' className='btn-blue-dark w-full' value={textButtonSave} />
              : <input type='submit' className='btn-blue-dark w-full' value={textButtonUpdate} />
            }
        </div>
      </form>
    </div>
  )
}

export default UserForm
