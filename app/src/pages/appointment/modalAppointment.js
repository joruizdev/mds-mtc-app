import { useEffect, useState } from 'react'
import { postRequest, putRequest } from '../../services/services'
import { useForm } from 'react-hook-form'
import { notificationError, notificationSuccess } from '../../notifications/notifications'
import { hourAppointment } from './resources'

const ModalAppointment = ({ show, token, reload, campus, eventEdit, textTitle, disabled }) => {
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0',
      appointmenttime: '08:00:00'
    }
  })

  const [textButtonSearch, setTextButtonSearch] = useState('Buscar')
  const [messageNoFound, setMessageNoFound] = useState('')
  const [classNameSchool, setClassNameSchool] = useState('hidden')
  const [classNameReschedule, setClassNameReschedule] = useState('hidden')

  useEffect(() => {
    if (eventEdit.length !== 0) {
      console.log(eventEdit)
      setValue('appointmenttime', eventEdit.appointmenttime)
      setValue('nrodoc', eventEdit.postulant.nrodoc)
      setValue('name', eventEdit.postulant.lastname + ' ' + eventEdit.postulant.name)
      setValue('typelic', eventEdit.typelic)
      setValue('typeproc', eventEdit.typeproc)
      setValue('school', eventEdit.school)
      setValue('nameschool', eventEdit.school ? eventEdit.nameschool : '')
      setValue('reschedule', eventEdit.reschedule)
      setValue('rescheduledate', eventEdit.reschedule ? new Date(eventEdit.rescheduledate).toISOString().split('T')[0] : '')
      setValue('observations', eventEdit.observations)

      eventEdit.school ? setClassNameSchool('block') : setClassNameSchool('hidden')
      eventEdit.reschedule ? setClassNameReschedule('block') : setClassNameReschedule('hidden')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const searchPostulant = async () => {
    setTextButtonSearch('Buscando')
    const nroDoc = getValues('nrodoc')
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
    textTitle === 'Actualizar cita' ? handleUpdate(data) : handleSave(data)
  }

  const handleSave = async (data) => {
    const newData = {
      ...data,
      campus,
      appointmentdate: new Date(String(data.appointmentdate).split('/').reverse().join('-')).toISOString(),
      postulantId: data.id,
      rescheduledate: data.reschedule ? data.rescheduledate : ''
    }

    await postRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Reserva de cita exitosa')
        reload()
        showModal()
      })
      .catch(error => {
        console.error(error)
        notificationError()
      })
  }

  const handleConfirmed = async () => {
    const newData = {
      confirmed: true,
      id: eventEdit.appointmentId
    }
    console.log(newData)
    await putRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Cita  confirmada')
        reload()
        showModal()
      })
      .catch(error => {
        console.error(error)
        notificationError()
      })
  }

  const handleCanceled = async () => {
    const newData = {
      canceled: true,
      id: eventEdit.appointmentId
    }
    await putRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Cita  cancelada')
        reload()
        showModal()
      })
      .catch(error => {
        console.error(error)
        notificationError()
      })
  }

  const handleUpdate = async (data) => {
    const newData = {
      ...data,
      id: eventEdit.appointmentId,
      rescheduledate: data.reschedule ? data.rescheduledate : ''
    }
    await putRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Datos de la cita actualizada satisfactoriamente')
        reload()
        showModal()
      })
      .catch(error => {
        console.error(error)
        notificationError()
      })
  }

  const showModal = () => {
    resetField('appointmenttime')
    show()
  }

  return (
    <div className='fixed z-50 top-0 left-0 w-full h-screen bg-stone-500 bg-opacity-60'>
      <div className='flex justify-center items-center h-full'>
        <div className='flex flex-col justify-between bg-white rounded-lg shadow-lg'>
          <div className='flex items-start justify-between p-5 rounded-t '>
            <h3 className='text-2xl'>{textTitle}</h3>
            <button
              className='float-right leading-none font-semibold outline-none focus:outline-none'
              onClick={showModal}
            >
              <span className='text-stone-500 h-6 w-6 text-4xl block outline-none focus:outline-none'>×</span>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col w-full'>
              <div className='relative p-5'>

                <div className='grid grid-cols-12 gap-5'>
                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-3'>
                      <span>Fecha: </span>
                      <input
                        type='date'
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className='input-date'
                        disabled={disabled}
                        {...register('appointmentdate', {
                          required: true
                        })}
                      />
                    </div>
                    {errors?.appointmentdate?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                  </div>

                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-3'>
                      <span>Hora: </span>
                      <select
                        className='input-select'
                        disabled={disabled}
                        {...register('appointmenttime', {
                          required: true
                        })}
                      >
                        {hourAppointment.map(elem =>
                          <option key={elem} value={elem}>{elem}</option>
                        )}
                      </select>
                    </div>
                    {errors?.appointmenttime?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                  </div>

                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-700 mb-1'>
                        Buscar postulante
                      </span>
                      <div className='flex flex-col mb-3'>
                        <div className='flex justify-between rounded-md p-0 py-0 border-0 w-full mb-1'>
                          <input
                            type='text'
                            className='py-1 px-3 placeholder-slate-400 focus:ring-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500  border border-slate-300 shadow-sm rounded-l-md w-full'
                            placeholder='Nro. documento'
                            {...register('nrodoc', {
                              required: true
                            })}
                          />
                          <input type='button' className='bg-mds-blue text-white rounded-r-md px-4 cursor-pointer' value={textButtonSearch} onClick={searchPostulant} disabled={disabled} />
                        </div>
                        <p className='text-red-500 text-sm'>{messageNoFound}</p>
                        {errors?.nrodoc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
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
                      {errors?.name?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
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
                          defaultValue={false}
                          onChangeCapture={() => {
                            if (!getValues('school')) {
                              register('nameschool', { required: true })
                              setClassNameSchool('block')
                            } else {
                              register('nameschool', { required: false })
                              setClassNameSchool('hidden')
                            }
                          }}
                          {...register('school')}
                        />
                        <label htmlFor='school'>¿Escuela?</label>
                      </div>
                      <input
                        type='text'
                        className={`input-text ${classNameSchool}`}
                        {...register('nameschool')}
                      />
                      {errors?.nameschool?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                    </div>
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-3'>
                      <div className='flex gap-4'>
                        <input
                          id='reschedule'
                          type='checkbox'
                          onChangeCapture={() => {
                            if (!getValues('reschedule')) {
                              register('rescheduledate', { required: true })
                              setClassNameReschedule('block')
                              setValue('rescheduledate', new Date().toISOString().split('T')[0])
                            } else {
                              register('rescheduledate', { required: false })
                              setClassNameReschedule('hidden')
                            }
                          }}
                          {...register('reschedule')}
                        />
                        <label htmlFor='reschedule'>¿Reprogramado?</label>
                      </div>
                      <input
                        type='date'
                        className={`input-text ${classNameReschedule}`}
                        defaultValue={new Date().toISOString().split('T')[0]}
                        {...register('rescheduledate')}
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
                        {...register('observations')}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className='flex items-center justify-end p-6  rounded-b gap-4'>
              <button
                className='btn-red-light'
                type='button'
                onClick={showModal}
              >
                Regresar
              </button>
              {
              textTitle === 'Actualizar cita'
                ? <><button type='button' className='btn-green-dark' onClick={handleConfirmed}>Confirmar</button><input type='submit' value='Actualizar' className='btn-blue-dark' /><button className='btn-red-dark' type='button' onClick={handleCanceled}>Cancelar</button></>
                : <input type='submit' value='Guardar' className='btn-blue-dark' />
              }
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default ModalAppointment
