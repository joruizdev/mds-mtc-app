import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { postRequest, putRequest } from '../../services/services'
import { messageAlert } from '../../notifications/notifications'

const PostulantForm = ({ token, reload, data }) => {
  const [titleForm, setTitleForm] = useState('Registrar nuevo postulante')
  const [firstLoad, setFirstLoad] = useState(false)

  const {
    register,
    handleSubmit,
    resetField,
    setValue,
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
      showEditPostulant()
    }
    setFirstLoad(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const showEditPostulant = () => {
    setTitleForm('Actualizar datos de postulante')
    setValue('id', data.id)
    setValue('name', String(data.name).toLowerCase())
    setValue('lastname', String(data.lastname).toLowerCase())
    setValue('typedoc', data.typedoc)
    setValue('nrodoc', data.nrodoc)
    setValue('gender', data.gender)
    setValue('telephone', data.telephone)
    setValue('adress', String(data.adress).toLowerCase())
    setValue('dateofbirth', new Date(data.dateofbirth).toISOString().split('T')[0])
  }

  const onSubmit = data => {
    titleForm === 'Registrar nuevo postulante' ? save(data) : update(data)
  }

  const save = async (data) => {
    const result = await postRequest('postulants/bynrodoc', data, token)
    if (result.length > 0) return messageAlert('Ya existe un postulante con el nro de documento ingresado', 'error')

    try {
      const response = await postRequest('postulants', data, token)
      console.log(response)
      messageAlert('Registro guardado satisfactoriamente', 'success')
      reload()
      handleCancel()
    } catch (error) {
      messageAlert('Ocurrió un error, por favor intentelo nuevamente', 'error')
    }
  }

  const update = async (data) => {
    try {
      const response = await putRequest('postulants', token)
      console.log(response)
      reload()
      handleCancel()
      messageAlert('Registro actualizado satisfactoriamente', 'success')
    } catch (error) {
      console.log(error)
      messageAlert('Ocurrió un error, por favor intentelo nuevamente', 'error')
    }
  }

  const handleCancel = () => {
    setTitleForm('Registrar nuevo postulante')
    resetField('id')
    resetField('name')
    resetField('lastname')
    resetField('typedoc')
    resetField('nrodoc')
    resetField('gender')
    resetField('telephone')
    resetField('dateregister')
    resetField('adress')
    resetField('dateofbirth')
    data = []
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
              {errors?.nrodoc?.type === 'valueAsNumber' && <p className='text-red-500 text-sm'>Solo se aceptan números</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Fecha de nacimiento
              </span>
              <input
                type='date'
                className='input-text'
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('dateofbirth', {
                  required: true
                })}
              />
              {errors?.dateofbirth?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Género
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
                Teléfono
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
              {errors?.telephone?.type === 'valueAsNumber' && <p className='text-red-500 text-sm'>Solo se aceptan números</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Fecha de registro
              </span>
              <input
                type='date'
                className='input-text'
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('dateregister', {
                  required: true
                })}
              />
              {errors?.dateofbirth?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
            </div>
          </div>

          <div className='col-span-12'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Dirección
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
            titleForm === 'Registrar nuevo postulante'
              ? <input type='submit' className='btn-blue-dark w-full' value='Guardar' />
              : <input type='submit' className='btn-blue-dark w-full' value='Actualizar' />
            }
        </div>
      </form>
    </div>
  )
}

export default PostulantForm
