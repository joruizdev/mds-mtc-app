import DataTable from 'react-data-table-component'

const ExpandCollection = ({ data }) => {
  return (
    <div className='flex gap-10'>
      <div className='py-2'>
        <h2 className='font-semibold pb-2'>Datos del cliente</h2>
        <p className='capitalize'>Cliente: {` ${data.postulant.lastname} ${data.postulant.name}`}</p>
        <p>Fecha de reserva: {` ${String(data.appointment.date).substring(0, 10).split('-').reverse().join('-')}`}</p>
        <p>Fecha de y hora atención: {` ${String(data.appointment.appointmentdate).substring(0, 10).split('-').reverse().join('-')} ${data.appointment.appointmenttime}`}</p>
        <p className='text-xl'>Total: {` ${data.price}`}</p>
        <p className='text-xl'>Saldo: {` ${data.price}`}</p>
      </div>
      <div className='py-2 grid grid-cols-9 gap-x-4'>
        <div className='col-span-9'>
          <h2 className='font-semibold pb-2'>Saldos</h2>
        </div>
        <div className='col-span-3'>
          <span>Estado: </span>
          <select
            className='input-select'
          >
            <option value='Pagado'>Pagado</option>
            <option value='Pendiente'>Pendiente</option>
          </select>
        </div>
        <div className='col-span-3'>
          <span>Tipo de pago: </span>
          <select
            className='input-select'
          >
            <option value='Parcial'>Parcial</option>
            <option value='Total'>Total</option>
          </select>
        </div>
        <div className='col-span-3'>
          <span>Importe</span>
          <input type='text' className='input-text' />
        </div>
        <div className='col-span-3'>
          <span>Fecha de pago</span>
          <input type='date' className='input-date' defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className='col-span-3'>
          <span>Forma de pago</span>
          <select className='input-select'>
            <option>Transferencia / Depósito</option>
            <option>Tarjeta crédito / débito</option>
            <option>Efectivo</option>
          </select>
        </div>
        <div className='col-span-3'>
          <span>Nro de operación</span>
          <input type='text' className='input-text' />
        </div>
      </div>
      <div className='py-2'>
        <h2>Historial</h2>
        <div>
          <DataTable />
        </div>
      </div>
    </div>
  )
}
export default ExpandCollection
