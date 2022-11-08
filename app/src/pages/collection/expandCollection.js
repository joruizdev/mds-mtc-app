import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'

const ExpandCollection = ({ data }) => {
  const [paymentDetail, setPaymentDetail] = useState([])
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0',
      appointmenttime: '08:00:00'
    }
  })

  const onSubmit = (data) => {

  }

  useEffect(() => {
    setPaymentDetail(data.paymentdetail)
    setValue('paymentstatus', data.paymentstatus)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      name: 'Fecha de pago',
      selector: row => row.paymentdate,
      sortable: true
    },
    {
      name: 'Importe',
      selector: row => row.amount,
      sortable: true
    },
    {
      name: 'Tipo de pago',
      selector: row => <span className='capitalize'>{row.paymenttype}</span>,
      sortable: true
    },
    {
      name: 'Forma de pago',
      selector: row => row.waytopay,
      sortable: true
    },
    {
      name: 'Nro. Operación',
      selector: row => row.operationnumber,
      sortable: true
    }
  ]
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex gap-10 justify-between'>
        <div className='py-2'>
          <h2 className='font-semibold pb-2'>Datos del cliente</h2>
          <div className='flex flex-col'>
            <div className='flex justify-between'>
              <p>Cliente: &nbsp;&nbsp;</p>
              <p className='capitalize font-semibold'>{`${data.postulant.lastname} ${data.postulant.name}`}</p>
            </div>
            <div className='flex justify-between'>
              <p>Fecha de registro: </p>
              <p className='font-semibold'>
                {
                  data.appointment
                    ? `${String(data.appointment.date).substring(0, 10).split('-').reverse().join('-')}`
                    : '--'
                }
              </p>
            </div>
            <div className='flex justify-between'>
              <p>Fecha de atención: </p>
              <p className='font-semibold'>
                {
                  data.appointment
                    ? `${String(data.appointment.appointmentdate).substring(0, 10).split('-').reverse().join('-')}`
                    : '--'
                  }
              </p>
            </div>
            <div className='flex justify-between'>
              <p>Hora de atención: </p>
              <p className='font-semibold'>
                {
                  data.appointment
                    ? `${data.appointment.appointmenttime}`
                    : '--'
                }
              </p>
            </div>
            <div className='flex justify-between'>
              <p>Total: </p>
              <p className='font-semibold font-nunito'>{`S/. ${data.price}.00`}</p>
            </div>
            <div className='flex justify-between'>
              <p>Total restante: </p>
              <p className='font-semibold font-nunito'>{`S/. ${Number(data.price) - Number(paymentDetail.map(item => item.amount).reduce((prev, curr) => prev + curr, 0))}.00`}</p>
            </div>
          </div>
        </div>
        <div className='py-2 grid grid-cols-9 gap-x-4'>
          <div className='col-span-9'>
            <h2 className='font-semibold pb-2'>Saldos</h2>
          </div>
          <div className='col-span-3'>
            <span>Estado: </span>
            <select
              className='input-select'
              {...register('paymentstatus', {
                required: true
              })}
            >
              <option value='pendiente'>Pendiente de pago</option>
              <option value='pago parcial'>Pago parcial</option>
              <option value='pago total'>Pago total</option>
            </select>
            {errors?.paymentstatus?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>
          <div className='col-span-3'>
            <span>Tipo de pago: </span>
            <select
              className='input-select'
              {...register('paymenttype', {
                required: true
              })}
            >
              <option value='Parcial'>Parcial</option>
              <option value='Total'>Total</option>
            </select>
            {errors?.paymenttype?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>
          <div className='col-span-3'>
            <span>Importe</span>
            <input
              type='text'
              className='input-text'
              {...register('amount', {
                required: true
              })}
            />
            {errors?.amount?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>
          <div className='col-span-3'>
            <span>Fecha de pago</span>
            <input
              type='date'
              className='input-date'
              defaultValue={new Date().toISOString().split('T')[0]}
              {...register('paymentdate', {
                required: true
              })}
            />
            {errors?.paymentdate?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>
          <div className='col-span-3'>
            <span>Forma de pago</span>
            <select
              className='input-select'
              {...register('waytopay', {
                required: true
              })}
            >
              <option>Transferencia / Depósito</option>
              <option>Tarjeta crédito / débito</option>
              <option>Efectivo</option>
            </select>
            {errors?.waytopay?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>
          <div className='col-span-3'>
            <span>Nro de operación</span>
            <input
              type='text'
              className='input-text'
              {...register('operationnumber', {
                required: true
              })}
            />
            {errors?.operationnumber?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
          </div>
        </div>
      </div>
      <div className='flex items-center gap-10'>
        <div className='w-2/4'>
          <span>Observaciones</span>
          <input
            type='text'
            className='input-text'
            {...register('paymentobservations', {
              required: true
            })}
          />
          {errors?.paymentobservations?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
        </div>
        <div className=''>
          <span>Adjunto</span>
          <label className='block'>
            <span className='sr-only'>Choose profile photo</span>
            <input
              type='file' className='block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-mds-blue
      hover:file:bg-blue-100
    '
              {...register('attached', {
                required: true
              })}
            />
          </label>
        </div>
      </div>
      <div className='py-2'>
        <h2 className='font-semibold'>Historial de pago</h2>
        <div>
          <DataTable
            columns={columns}
            data={paymentDetail}
          />
        </div>
      </div>
      <div className='flex gap-4 py-4 justify-end'>
        <button className='btn-red-light'>Canelar</button>
        <input type='submit' className='btn-blue-dark' value='Guardar' />
      </div>
    </form>
  )
}
export default ExpandCollection
