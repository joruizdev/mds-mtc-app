import { useRef, useState } from 'react'
import { postRequest } from '../../services/services'
import { useForm } from 'react-hook-form'
import { notificationError, notificationSuccess } from '../../notifications/notifications'

const ModalForm = ({ token, event, reload, campus }) => {
  const {
    register,
    handleSubmit,
    // resetField,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0'
    }
  })
  const [textButtonSearch, setTextButtonSearch] = useState('Buscar')
  const [messageNoFound, setMessageNoFound] = useState('')
  const txtNroDoc = useRef()

  const searchPostulant = async () => {
    setTextButtonSearch('Buscando')
    const nroDoc = txtNroDoc.current.value
    const data = { nrodoc: nroDoc.trim() }
    const postulant = await postRequest('postulants/bynrodoc', data, token)

    if (postulant.length > 0) {
      setValue('name', postulant[0].lastname + ' ' + postulant[0].name)
      setValue('id', postulant[0].id)
      setMessageNoFound('')
    } else {
      setMessageNoFound('No se encontraron registros')
    }
    await setTextButtonSearch('Buscar')
  }

  const onSubmit = (data) => {
    handleSave(data)
  }

  const handleSave = async (data) => {
    const newData = {
      ...data,
      campus,
      appointmentdate: new Date(String(data.appointmentdate).split('/').reverse().join('-')).toISOString(),
      postulantId: data.id
    }
    await postRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Reserva de cita exitosa')
      })
      .catch(error => {
        console.error(error)
        notificationError()
      })
    reload()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col w-full'>
        <div className='relative p-5'>
          <div className='mb-3'>
            <span>Fecha: </span>
            <input
              type='text'
              value={new Date(event.date).toLocaleDateString()}
              readOnly
              className='input-text'
              {...register('appointmentdate')}
            />
            <span>Hora: </span>
            <input
              type='text'
              value={
                    String(new Date(event.date).toLocaleTimeString()).split(':')[0].length === 1
                      ? String('0' + new Date(event.date).toLocaleTimeString())
                      : new Date(event.date).toLocaleTimeString()
                  }
              readOnly
              className='input-text'
              {...register('appointmenttime')}
            />
          </div>
          <div className='grid grid-cols-12 gap-5'>

            <div className='col-span-12 md:col-span-6'>
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
                  <p className='text-red-500 text-sm'>{messageNoFound}</p>
                </div>
              </div>
            </div>
            <input
              type='hidden'
              {...register('id')}
            />

            <div className='col-span-12 md:col-span-6'>
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
            </div>
            <div className='col-span-12 md:col-span-6'>
              <div>
                <div className='flex flex-col mb-3'>
                  <span className='text-sm font-medium text-gray-700'>
                    Tipo de procedimiento
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
            </div>
            <div className='col-span-12 md:col-span-6'>
              <div>
                <div className='flex flex-col mb-3'>
                  <span className='text-sm font-medium text-gray-700'>
                    Tipo de licencia
                  </span>
                  <select
                    className='input-select'
                    {...register('typeproc', {
                      required: true
                    })}
                  >
                    <option value='Licencia Nueva'>Licencia nueva</option>
                    <option value='Revalidación'>Revalidación</option>
                    <option value='Categorización'>Categorización</option>
                    <option value='Licencia especial'>Licencia especial</option>
                  </select>
                </div>
                {errors?.typeproc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
              </div>
            </div>
            <div className='col-span-12 md:col-span-6'>
              <div className='flex flex-col mb-3'>
                <div className='flex gap-4'>
                  <input
                    id='school'
                    type='checkbox'
                    {...register('school', {
                      required: true
                    })}
                  />
                  <label htmlFor='school'>¿Escuela?</label>
                </div>
                <input
                  type='text'
                  className='input-text'
                  {...register('nameschool', {
                    required: true
                  })}
                />
              </div>
            </div>
            <div className='col-span-12 md:col-span-6'>
              <div className='flex flex-col mb-3'>
                <div className='flex gap-4'>
                  <input
                    id='reschedule'
                    type='checkbox'
                    {...register('reschedule', {
                      required: true
                    })}
                  />
                  <label htmlFor='reschedule'>¿Reprogramado?</label>
                </div>
                <input
                  type='date'
                  className='input-text'
                  defaultValue={new Date().toISOString().split('T')[0]}
                  {...register('rescheduledate', {
                    required: true
                  })}
                />
              </div>
            </div>
            <div className='col-span-12'>
              <div className='flex flex-col mb-3'>
                <span className='text-sm font-medium text-gray-700'>
                  Observaciones
                </span>
                <textarea
                  rows='5'
                  className='input-text'
                  {...register('observations', {
                    required: true
                  })}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  )
}

export default ModalForm
