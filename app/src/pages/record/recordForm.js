import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { postRequest } from '../../services/services'

const RecordForm = ({ token, records, campus }) => {
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
  const navigate = useNavigate()
  const txtNroDoc = useRef()

  const onSubmit = async data => {
    const nroDoc = txtNroDoc.current.value
    const result = await records.filter(record => record.postulant.nrodoc === nroDoc.trim() && record.canceled === false)
    if (result.length > 0) {
      return messageAlert('Ya existe un record del postulante con fecha de hoy', 'error')
    }

    data.postulantId = data.id
    data.campus = campus
    data.order = records.length + 1

    await postRequest('records', data, token)
      .then(
        data => {
          console.log(data)
        },
        messageAlert('Record registrado satisfactoriamente', 'success'),
        navigate('/'),
        navigate(0))
  }

  const handleCancel = () => {
    resetField('id')
    resetField('name')
    resetField('typelic')
    resetField('typeproc')
    resetField('observations')
    resetField('price')
  }

  const searchPostulant = async () => {
    const nroDoc = txtNroDoc.current.value
    const data = { nrodoc: nroDoc.trim() }
    const postulant = await postRequest('postulants/bynrodoc', data, token)

    if (postulant.length > 0) {
      setValue('name', postulant[0].lastname + ' ' + postulant[0].name)
      setValue('id', postulant[0].id)
      setMessageNoFound('')
    } else {
      setMessageNoFound('No se encontraron registros')
      handleCancel()
    }
  }

  const messageAlert = (text, icon) => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      text,
      position: 'top-end',
      icon,
      showConfirmButton: false,
      timer: 1500
    })
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
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>
                Buscar postulante
              </span>
              <div className='flex mb-3'>
                <input
                  type='text'
                  className='input-text border-r-0 rounded-r-none'
                  placeholder='Nro. documento'
                  ref={txtNroDoc}
                />
                <input type='button' className='mt-1 rounded-l-none btn-blue-dark cursor-pointer' value='Buscar' onClick={searchPostulant} />
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

          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
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
            <div className='flex items-center gap-5'>
              S/.
              <input
                type='text'
                className='input-text text-end'
                {...register('price', {
                  required: true
                })}
              />
            </div>
          </div>
          {errors?.typeproc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
        </div>
        <div className='flex flex-col pt-5 gap-4 w-full md:flex-row lg:w-80'>
          <button
            type='button'
            className='btn-red-light w-full'
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <input type='submit' className='btn-blue-dark w-full' value='Guardar' />
        </div>
      </form>
    </div>
  )
}

export default RecordForm
