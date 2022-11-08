import { useEffect, useState } from 'react'
import { postRequest, putRequest } from '../../services/services'
import { useForm } from 'react-hook-form'
import { notificationError, notificationSuccess } from '../../notifications/notifications'
import { hourAppointment } from './resources'
import { useNavigate } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

const ModalAppointment = ({ show, token, user, reload, campus, eventEdit, textTitle, disabled }) => {
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
  const [disabledNameSchool, setDisabledNameSchool] = useState(true)
  const [disabledReschedule, setDisabledReschedule] = useState(true)
  // const [disabledPaid, setDisabledPaid] = useState(true)
  // const [disableAmount, setDisabledAmount] = useState(true)
  const [textButtonSave, setTextButtonSave] = useState('Reservar')
  const [textButtonConfirm, setTextButtonConfirm] = useState('Confirmar')
  const [textButtonCancel, setTextButtonCancel] = useState('Cancelar')
  const [textButtonUpdate, setTextButtonUpdate] = useState('Actualizar')
  // const [reqAmount, setReqAmount] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (eventEdit.length !== 0) {
      // console.log(eventEdit)
      setValue('appointmentdate', new Date(eventEdit.appointmentdate).toISOString().split('T')[0])
      setValue('appointmenttime', eventEdit.appointmenttime)
      setValue('nrodoc', eventEdit.postulant.nrodoc)
      setValue('name', eventEdit.postulant.lastname + ' ' + eventEdit.postulant.name)
      setValue('typelic', eventEdit.typelic)
      setValue('typeproc', eventEdit.typeproc)
      setValue('school', eventEdit.school)
      setValue('nameschool', eventEdit.school ? eventEdit.nameschool : '')
      setValue('reschedule', eventEdit.reschedule)
      setValue('rescheduledate', eventEdit.reschedule ? new Date(eventEdit.rescheduledate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
      setValue('observations', eventEdit.observations)
      setValue('price', eventEdit.price)
      setValue('campus', eventEdit.campus)

      // eventEdit.school ? setClassNameSchool('block') : setClassNameSchool('hidden')
      // eventEdit.reschedule ? setClassNameReschedule('block') : setClassNameReschedule('hidden')
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
    setTextButtonSave('Verificando...')
    const dateAppointment = new Date(data.appointmentdate + ' ' + data.appointmenttime)
    if (Date.parse(dateAppointment) < Date.parse(new Date())) {
      setTextButtonSave('Reservar')
      return notificationError('No se puede reservar una cita con fecha y hora menor que la fecha y hora actual')
    }

    const newDate = new Date().toLocaleDateString().split('/').reverse().join('-')

    const newData = {
      ...data,
      dateStart: newDate,
      dateEnd: newDate,
      canceled: false,
      campus,
      appointmentdate: new Date(String(data.appointmentdate).split('/').reverse().join('-')).toISOString(),
      postulantId: data.id,
      rescheduledate: data.reschedule ? data.rescheduledate : '',
      paymentstatus: data.paid ? data.paymentstatus : ''
    }

    const resultOne = await postRequest('appointment/verifyduplicatedtime', newData, token)
    if (resultOne.length > 0) {
      setTextButtonSave('Reservar')
      return notificationError(`Ya existe una cita reservada en el horario de las ${data.appointmenttime} horas`, 'error')
    }

    const result = await postRequest('appointment/verifyduplicated', newData, token)
    if (result.length > 0) {
      setTextButtonSave('Reservar')
      return notificationError('Ya existe una cita del postulante con fecha seleccionada', 'error')
    }

    setTextButtonSave('Reservando...')
    await postRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Reserva de cita exitosa')
        reload()
        showModal()
        setTextButtonSave('Reservar')
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
        setTextButtonSave('Reservar')
      })
  }

  // eslint-disable-next-line no-unused-vars
  /* const saveAttentionDetail = async (data) => {
    const newAttentionDetail = {
      postulantId: data.postulant.id,
      userId: user,
      recordId: '',
      appointmentId: data.id,
      price: data.price,
      paid: false,
      paymentstatus: '',
      paymentdetail: []
    }
    await postRequest('attention-detail', newAttentionDetail, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Detalle de atencion registrada satisfactoriamente')
        reload()
        showModal()
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
      })
  } */

  const handleConfirmed = async () => {
    setTextButtonConfirm('Confirmando...')
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
        setTextButtonConfirm('Confirmar')
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
        setTextButtonConfirm('Confirmar')
      })
  }

  const handleCanceled = async () => {
    const MySwal = withReactContent(Swal)
    setTextButtonCancel('Cancelando...')
    MySwal.fire({
      text: 'Por favor, indique el motivo por el cual desea cancelar la cita',
      input: 'text',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar cita',
      confirmButtonColor: '#2c70b6',
      cancelButtonText: 'Regresar',
      preConfirm: (reason) => {
        if (reason.length > 0) {
          return reason
        } else {
          Swal.showValidationMessage(
            'Por favor indique el motivo'
          )
        }
      }
    }).then(async (result) => {
      setTextButtonCancel('Cancelar')
      if (result.isConfirmed) {
        const newData = {
          canceled: true,
          id: eventEdit.appointmentId,
          reason: result.value
        }
        await putRequest('appointment', newData, token)
          .then(response => {
            console.log(response)
            notificationSuccess('Cita  cancelada')
            reload()
            showModal()
            setTextButtonCancel('Cancelar')
          })
          .catch(e => {
            console.log(e)
            if (e.response.data.error === 'token expired') return navigate('/session-expired')
            notificationError()
            setTextButtonCancel('Cancelar')
          })
      }
    })
    /* setTextButtonCancel('Cancelando...')
    const newData = {
      canceled: true,
      id: eventEdit.appointmentId
    } */
    /* await putRequest('appointment', newData, token)
      .then(response => {
        console.log(response)
        notificationSuccess('Cita  cancelada')
        reload()
        showModal()
        setTextButtonCancel('Cancelar')
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
        setTextButtonCancel('Cancelar')
      }) */
  }

  const handleUpdate = async (data) => {
    setTextButtonUpdate('Actualizando...')
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
        setTextButtonUpdate('Actualizar')
      })
      .catch(e => {
        console.log(e)
        if (e.response.data.error === 'token expired') return navigate('/session-expired')
        notificationError()
        setTextButtonUpdate('Actualizar')
      })
  }

  const showModal = () => {
    resetField('appointmenttime')
    show()
  }

  /* const handleChangePaymentStatus = (e) => {
    if (e.target.value === 'parcial') {
      setDisabledAmount(false)
    } else {
      setDisabledAmount(true)
      setValue('amount', getValues('price'))
    }
  } */

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

                <p className='hidden pb-4 text-end'>{`Local: ${eventEdit.campus}`}</p>

                <div className='grid grid-cols-12 gap-5'>

                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-1'>
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
                    <div className='flex flex-col mb-1'>
                      <span>Hora: </span>
                      <select
                        className='input-select font-nunito'
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
                      <div className='flex flex-col mb-1'>
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
                    <div className='flex flex-col mb-1'>
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
                      <div className='flex flex-col mb-1'>
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
                  </div>

                  <div className='col-span-12 md:col-span-6'>
                    <div>
                      <div className='flex flex-col mb-1'>
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
                          <option value='Revalidación'>Revalidación</option>
                          <option value='Categorización'>Categorización</option>
                          <option value='Licencia especial'>Licencia especial</option>
                        </select>
                      </div>
                      {errors?.typeproc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                    </div>
                  </div>

                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-1'>
                      <div className='flex gap-4'>
                        <input
                          id='school'
                          type='checkbox'
                          defaultValue={false}
                          onChangeCapture={() => {
                            if (!getValues('school')) {
                              register('nameschool', { required: true })
                              setDisabledNameSchool(false)
                            } else {
                              register('nameschool', { required: false })
                              setDisabledNameSchool(true)
                            }
                          }}
                          {...register('school')}
                        />
                        <label htmlFor='school'>¿Escuela?</label>
                      </div>
                      <input
                        type='text'
                        className='input-text disabled:bg-slate-100'
                        disabled={disabledNameSchool}
                        {...register('nameschool')}
                      />
                      {errors?.nameschool?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                    </div>
                  </div>

                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-1'>
                      <div className='flex gap-4'>
                        <input
                          id='reschedule'
                          type='checkbox'
                          onChangeCapture={() => {
                            if (!getValues('reschedule')) {
                              register('rescheduledate', { required: true })
                              setDisabledReschedule(false)
                              setValue('rescheduledate', new Date().toISOString().split('T')[0])
                            } else {
                              register('rescheduledate', { required: false })
                              setDisabledReschedule(true)
                            }
                          }}
                          {...register('reschedule')}
                        />
                        <label htmlFor='reschedule'>¿Reprogramado?</label>
                      </div>
                      <input
                        type='date'
                        className='input-text disabled:bg-slate-100'
                        disabled={disabledReschedule}
                        defaultValue={new Date().toISOString().split('T')[0]}
                        {...register('rescheduledate')}
                      />
                    </div>
                  </div>

                  <div className='col-span-12 md:col-span-6'>
                    <div className='flex flex-col mb-1'>
                      <span className='text-sm font-medium text-gray-700'>
                        Costo de examen
                      </span>
                      <div className='flex items-center gap-2'>
                        <span>S/.</span>
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

                  {/* <div className='col-span-12 md:col-span-6'>
                    <div className='flex justify-center items-center gap-5'>
                      <div className='flex flex-col mb-1'>
                        <div className='flex gap-4'>
                          <input
                            id='paid'
                            type='checkbox'
                            defaultValue={false}
                            onChangeCapture={() => {
                              if (!getValues('paid')) {
                                register('paymentstatus', { required: true })
                                setReqAmount(true)
                                setDisabledPaid(false)
                                setValue('amount', getValues('price'))
                              } else {
                                register('paymentstatus', { required: false })
                                setReqAmount(false)
                                setDisabledPaid(true)
                                setValue('amount', '')
                              }
                            }}
                            {...register('paid')}
                          />
                          <label htmlFor='paid'>¿Pagado?</label>
                        </div>
                        <select
                          disabled={disabledPaid}
                          className='input-select disabled:bg-slate-100'
                          {...register('paymentstatus')}
                          onChangeCapture={(e) => { handleChangePaymentStatus(e) }}
                        >
                          <option value='total'>Total</option>
                          <option value='parcial'>Parcial</option>
                        </select>
                        {errors?.paymentstatus?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                      </div>
                      <div className='flex flex-col mb-1'>
                        <span className='text-sm font-medium text-gray-700'>
                          Importe
                        </span>
                        <div className='flex items-center gap-4'>
                          <span>{'S/. '}</span>
                          <input
                            type='text'
                            className='input-text text-end disabled:bg-slate-100'
                            disabled={disableAmount}
                            {...register('amount', { required: reqAmount })}
                          />
                        </div>
                        {errors?.amount?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
                      </div>
                    </div>
                  </div> */}

                  <div className='col-span-12'>
                    <div className='flex flex-col mb-1'>
                      <span className='text-sm font-medium text-gray-700'>
                        Observaciones
                      </span>
                      <textarea
                        rows='2'
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
                ? <><button type='button' className='btn-green-dark' onClick={handleConfirmed}>{textButtonConfirm}</button><input type='submit' value={textButtonUpdate} className='btn-blue-dark' /><button className='btn-red-dark' type='button' onClick={handleCanceled}>{textButtonCancel}</button></>
                : <input type='submit' value={textButtonSave} className='btn-blue-dark' />
              }
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default ModalAppointment
