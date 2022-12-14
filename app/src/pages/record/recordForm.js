import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { postRequest, putRequest } from '../../services/services'
import { notificationError, notificationSuccess } from '../../notifications/notifications'

const RecordForm = ({ token, records, campus, postulantAppointment, appoinmentOpc }) => {
  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0'
    }
  })

  const [messageNoFound, setMessageNoFound] = useState('')
  const [textButtonSearch, setTextButtonSearch] = useState('Buscar')
  const [textButtonSave, setTextButtonSave] = useState('Guardar')
  const [isAppointment, setIsAppointment] = useState(false)
  const navigate = useNavigate()
  const txtNroDoc = useRef()

  const showPostulantAppointment = () => {
    if (appoinmentOpc) {
      setIsAppointment(true)
      console.log('Mostrar datos de la cita del postulante')
      console.log(postulantAppointment)
      txtNroDoc.current.value = postulantAppointment.postulant.nrodoc
      setValue('name', postulantAppointment.postulant.lastname + ' ' + postulantAppointment.postulant.name)
      setValue('id', postulantAppointment.postulant.id)
      setValue('typelic', postulantAppointment.typelic)
      setValue('typeproc', postulantAppointment.typeproc)
      setValue('idappointment', postulantAppointment.id)
      setValue('price', postulantAppointment.price)
    }
  }

  useEffect(() => {
    showPostulantAppointment()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appoinmentOpc, postulantAppointment])

  const onSubmit = async data => {
    setTextButtonSave('Verificando...')
    // const nroDoc = txtNroDoc.current.value
    const newDate = new Date().toLocaleDateString().split('/').reverse().join('-')
    const newData = {
      dateStart: newDate,
      dateEnd: newDate,
      canceled: false,
      postulantId: data.id
    }
    const result = await postRequest('records/verifyduplicated', newData, token)
    if (result.length > 0) {
      setTextButtonSave('Guardar')
      return notificationError('Ya existe un record del postulante con fecha de hoy', 'error')
    }

    data.postulantId = data.id
    data.campus = campus
    data.order = records.length + 1
    await postRequest('records', data, token)
      .then(response => {
        setTextButtonSave('Guardando...')
        console.log(response)
        notificationSuccess('Record registrado satisfactoriamente')
        if (!isAppointment) {
          navigate('/')
          // navigate(0)
        }
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
      })

    if (isAppointment) {
      postulantAppointment.attended = true
      await putRequest('appointment', postulantAppointment, token)
        .then(response => {
          setTextButtonSave('Actualizando...')
          console.log(response)
          navigate('/')
          notificationSuccess('Citas actualizadas correctamente')
        })
        .catch(e => {
          console.log(e)
          if (e.response.data.error === 'token expired') return navigate('/session-expired')
          notificationError()
        })
    }
    setTextButtonSave('Guardar')
  }

  const handleCancel = () => {
    resetField('id')
    resetField('name')
    resetField('typelic')
    resetField('typeproc')
    resetField('observations')
    resetField('price')
    resetField('idappointment')
  }

  const searchPostulant = async () => {
    setTextButtonSearch('Buscando...')
    setIsAppointment(false)
    const nroDoc = txtNroDoc.current.value
    const data = { nrodoc: nroDoc.trim() }
    const postulant = await postRequest('postulants/bynrodoc', data, token)

    if (postulant.length > 0) {
      setValue('name', postulant[0].lastname + ' ' + postulant[0].name)
      setValue('id', postulant[0].id)
      setMessageNoFound('')
      console.log(postulant)
    } else {
      setMessageNoFound('No se encontraron registros')
      handleCancel()
    }
    await setTextButtonSearch('Buscar')
  }

  return (
    <div>
      <h1 className='text-xl pb-5'>Registrar nuevo record</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-12 gap-5'>
          <input
            type='hidden'
            {...register('id')}
          />
          <input
            type='hidden'
            {...register('idappointment')}
          />
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700 mb-1'>
                Buscar postulante
              </span>
              <div className='flex mb-3'>
                <div className='flex justify-between rounded-md p-0 py-0 border-0 w-full mb-1'>
                  <input
                    type='text'
                    className='py-1 px-3 placeholder-slate-400 focus:ring-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500  border border-slate-300 shadow-sm rounded-l-md w-full'
                    placeholder='Nro. documento'
                    ref={txtNroDoc}
                  />
                  <input type='button' className='bg-mds-blue text-white rounded-r-md px-4 cursor-pointer' value={textButtonSearch} onClick={searchPostulant} />
                </div>
              </div>
            </div>
            <p className='text-red-500 text-sm'>{messageNoFound}</p>
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Apellidos y nombres
              </span>
              <input
                type='text'
                className='input-text disabled:bg-slate-100'
                disabled
                {...register('name', {
                  required: true
                })}
              />
            </div>
            {errors?.name?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Tipo de licencia
              </span>
              <select
                className='input-select'
                {...register('typelic', {
                  required: true
                })}
              >
                <option value='A-I'>A-I</option>
                <option value='A-IIa'>A-IIa</option>
                <option value='A-IIb'>A-IIb</option>
                <option value='A-IIIa'>A-IIIa</option>
                <option value='A-IIIb'>A-IIIb</option>
                <option value='A-IIIc'>A-IIIc</option>
                <option value='B-I'>B-I</option>
                <option value='B-IIa'>B-IIa</option>
                <option value='B-IIb'>B-IIb</option>
                <option value='B-IIc'>B-IIc</option>
              </select>
            </div>
            {errors?.typelic?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Tipo de procedimiento
              </span>
              <select
                className='input-select'
                {...register('typeproc', {
                  required: true
                })}
              >
                <option value='Licencia Nueva'>Licencia nueva</option>
                <option value='Revalidaci??n'>Revalidaci??n</option>
                <option value='Categorizaci??n'>Categorizaci??n</option>
                <option value='Licencia especial'>Licencia especial</option>
              </select>
            </div>
            {errors?.typeproc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>

          <div className='col-span-12'>
            <div className='flex flex-col mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Observaciones
              </span>
              <input
                type='text'
                className='input-text'
                {...register('observations')}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end items-end text-end py-4'>
          <div className='flex flex-col mb-3'>
            <span className='text-sm font-medium text-gray-700'>
              Precio del examen
            </span>
            <div className='flex items-center gap-5 mb-3'>
              S/.
              <input
                type='text'
                className='input-text text-end'
                {...register('price', {
                  required: true
                })}
              />
            </div>
            {errors?.price?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
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
          <input type='submit' className='btn-blue-dark w-full' value={textButtonSave} />
        </div>
      </form>
    </div>
  )
}

export default RecordForm
