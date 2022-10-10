import { useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import list from './resourceFormVoucher'

const CreateVoucherForm = ({ rows }) => {
  const { listGoodsAndServices, listPercentageDetraction } = list

  const {
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0'
    }
  })

  const [textPlaceHoldernputSearch, setTextPlaceHoldernputSearch] = useState('Nro. DNI')
  // eslint-disable-next-line no-unused-vars
  const [dataClient, setDataClient] = useState([])
  const [client, setClient] = useState([{ client: '', idClient: '', adress: '', city: '' }])
  const [typeVoucher, setTypeVoucher] = useState('BOLETA ELECTRÓNICA')
  const [serieVoucher, setSerieVoucher] = useState('B001')
  const [nroVoucher, setNroVoucher] = useState('0000004454')
  const rdbDNI = useRef()
  const infoDetraction = useRef()
  const infoAmountDetraction = useRef()
  const infoAmountRetention = useRef()
  const netPayable = useRef()

  const clientWithDNI = {
    firstName: 'Abel',
    lastName: 'Benito Loza',
    NroDoc: 10525555,
    adress: 'Calle Albert Einstein Mz. H Lote 22 Urb. La Calera de la Merced - Surquillo',
    district: 'Surquillo',
    province: 'Lima',
    department: 'Lima'
  }

  const clientWithRUC = {
    businessName: 'Medicos Salud Unión En Alerta SAC',
    adress: 'Calle Albert Einstein Mz. H Lote 22 Urb. La Calera de la Merced - Surquillo',
    nroRUC: 20491987368,
    district: 'Surquillo',
    province: 'Lima',
    department: 'Lima'
  }

  console.log(errors)

  const handleChangeTextRadioDNI = () => {
    setTextPlaceHoldernputSearch('Nro. DNI')
    setTypeVoucher('BOLETA ELECTRÓNICA')
    setSerieVoucher('B001')
    setNroVoucher('0000004454')
  }

  const handleChangeTextRadioRUC = () => {
    setTextPlaceHoldernputSearch('Nro. RUC')
    setTypeVoucher('FACTURA ELECTRÓNICA')
    setSerieVoucher('F001')
    setNroVoucher('0000004521')
  }

  const handleChangeDetraction = () => {
    infoDetraction.current.classList.toggle('hidden')
    infoAmountDetraction.current.classList.toggle('hidden')
    netPayable.current.classList.remove('hidden', 'block')
    if (!infoAmountDetraction.current.classList.contains('hidden') || !infoAmountRetention.current.classList.contains('hidden')) {
      netPayable.current.classList.add('block')
      netPayable.current.classList.remove('hidden')
    }
    if (infoAmountDetraction.current.classList.contains('hidden') && infoAmountRetention.current.classList.contains('hidden')) {
      netPayable.current.classList.add('hidden')
    }
  }
  const handleChangeRetention = () => {
    infoAmountRetention.current.classList.toggle('hidden')
    netPayable.current.classList.remove('hidden', 'block')
    if (!infoAmountDetraction.current.classList.contains('hidden') || !infoAmountRetention.current.classList.contains('hidden')) {
      netPayable.current.classList.add('block')
      netPayable.current.classList.remove('hidden')
    }
    if (infoAmountDetraction.current.classList.contains('hidden') && infoAmountRetention.current.classList.contains('hidden')) {
      netPayable.current.classList.add('hidden')
    }
  }

  const handleSearchClient = () => {
    rdbDNI.current.checked ? setDataClient(clientWithDNI) : setDataClient(clientWithRUC)
    setClient([{
      client: rdbDNI.current.checked ? clientWithDNI.firstName + ' ' + clientWithDNI.lastName : clientWithRUC.businessName,
      idClient: rdbDNI.current.checked ? clientWithDNI.NroDoc : clientWithRUC.nroRUC,
      adress: rdbDNI.current.checked ? clientWithDNI.adress : clientWithRUC.adress,
      city: rdbDNI.current.checked
        ? clientWithDNI.district + '-' + clientWithDNI.province + '-' + clientWithDNI.department
        : clientWithRUC.district + '-' + clientWithRUC.province + '-' + clientWithRUC.department
    }])
  }

  const onSubmit = async data => {
  }

  const columns = [
    {
      name: 'Item',
      selector: row => row.id
    },
    {
      name: 'Cantidad',
      selector: row => '01'
    },
    {
      name: 'Unidad',
      selector: row => 'UND'
    },
    {
      name: 'Descripción',
      selector: row =>
        <span className='capitalize'>
          Examen médico para brevete
          {' ' + String(row.postulant.lastname).toLowerCase() + ' ' +
          String(row.postulant.name).toLowerCase()} - {row.typeproc} - {row.typelic}
        </span>,
      sortable: true,
      wrap: true
    },
    {
      name: 'Costo unit',
      selector: row => `S/. ${parseFloat(parseFloat('250.00').toFixed(2) / 1.18).toFixed(2)}`
    },
    {
      name: 'Costo unit + IGV',
      selector: row => `S/. ${parseFloat('250.00').toFixed(2)}`
    },
    {
      name: 'Importe',
      selector: row => `S/. ${parseFloat('250.00').toFixed(2)}`
    }
  ]
  return (
    <div className='container mx-auto my-5 py-5 bg-white rounded-md px-4'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <div className='flex gap-10'>
                <div className='flex gap-2 text-sm font-medium text-gray-700'>
                  <input ref={rdbDNI} type='radio' id='rdbDNI' name='rdbVoucher' onChange={handleChangeTextRadioDNI} defaultChecked />
                  <label htmlFor='rdbDNI'>DNI</label>
                </div>
                <div className='flex gap-2 text-sm font-medium text-gray-700'>
                  <input type='radio' id='rdbRUC' name='rdbVoucher' onChange={handleChangeTextRadioRUC} />
                  <label htmlFor='rdbRUC'>RUC</label>
                </div>
              </div>
              <div className='flex mb-3'>
                <input
                  type='text'
                  className='input-text border-r-0 rounded-r-none'
                  placeholder={textPlaceHoldernputSearch}
                />
                <input type='button' className='mt-1 rounded-l-none btn-blue-dark cursor-pointer' value='Buscar' onClick={handleSearchClient} />
              </div>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-3 md:order-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Cliente</span>
              <input type='email' className='input-text' readOnly value={client[0].client} />
            </div>
          </div>
          <div className='col-span-12 order-first md:col-span-6 lg:col-span-3 md:order-2 lg:order-3 xl:order-4 md:row-span-2 '>
            <div className='flex flex-col items-center justify-center border border-mds-yellow rounded-md p-4 h-full'>
              <p className='text-xl'>RUC: 20491987368</p>
              <p className='text-xl'>{typeVoucher}</p>
              <p className='text-xl'>#{serieVoucher + '-' + nroVoucher}</p>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-4 lg:order-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Dirección</span>
              <input type='text' className='input-text' readOnly value={client[0].adress} />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-4'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Cuidad</span>
              <input type='text' className='input-text' readOnly value={client[0].city} />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-5'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Email</span>
              <input type='email' className='input-text' />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-6'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Fecha emisión</span>
              <input type='date' className='input-text' defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-7'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Fecha vencimiento</span>
              <input type='date' className='input-text' defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-8'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Moneda</span>
              <select className='input-text pt-2'>
                <option>Soles</option>
                <option>Dólares</option>
              </select>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-9'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Condición de pago</span>
              <input type='text' className='input-text' />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-10'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Orden de compra</span>
              <input type='text' className='input-text' />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-11'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Guía de remisión</span>
              <input type='text' className='input-text' />
            </div>
          </div>
        </div>
        <div className='pb-5 my-5 rounded-lg border border-yellow-500 px-4'>
          <DataTable
            columns={columns}
            data={rows}
            pagination={false}
            highlightOnHover
          />
        </div>
        <div className='flex flex-col py-4'>
          <span className='text-sm font-medium text-gray-700'>Observaciones</span>
          <input type='text' className='input-text' />
        </div>
        <div className='flex flex-col justify-between py-4 lg:flex-row'>
          <div className='flex flex-col items-end md:items-start'>
            <div className='flex'>
              <div className='flex flex-col gap-4 pr-10'>
                <div className='flex gap-2'>
                  <input type='checkbox' id='chkDiscount' />
                  <label htmlFor='chkDiscount'>Descuento %</label>
                </div>
                <div className='flex gap-2'>
                  <input type='checkbox' id='chkRetention' onChange={handleChangeRetention} />
                  <label htmlFor='chkRetention'>Retención</label>
                </div>
                <div className='flex gap-2'>
                  <input type='checkbox' id='chkDetraction' onChange={handleChangeDetraction} />
                  <label htmlFor='chkDetraction'>Detracción</label>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <input type='text' className='border border-stone-400 rounded-md px-2 w-20' />
                <select className='border border-stone-400 rounded-md px-2 w-20'>
                  <option>0 %</option>
                  <option>3 %</option>
                  <option>6 %</option>
                </select>
                <select className='border border-stone-400 rounded-md px-2 w-20'>
                  {listPercentageDetraction.map(elem =>
                    <option key={elem}>{elem}</option>
                  )}
                </select>
              </div>
            </div>
            <div ref={infoDetraction} className='pt-5 hidden'>
              <p>Cuenta Banco de la Nación: 00063024546</p>
              <div className='flex flex-col py-2'>
                <span>Código de bienes y servicios sujetos a detracción</span>
                <select className='border border-stone-400 rounded-md px-2 py-1 w-full lg:w-96'>
                  {listGoodsAndServices.map(elem =>
                    <option key={elem}>{elem}</option>
                  )}
                </select>
              </div>
            </div>
            <div className='flex gap-4 py-4'>
              <p ref={infoAmountRetention} className='hidden'>Retención: <span className=''>S/.150.00</span></p>
              <p ref={infoAmountDetraction} className='hidden'>Detracción: <span className=''>S/.150.00</span></p>
              <p ref={netPayable} className='hidden'>Neto a pagar: <span className=''>S/.150.00</span></p>
            </div>
          </div>
          <div className='flex flex-col justify-between pt-4'>
            <div className='flex flex-col gap-4 text-right'>
              <p>Subtotal: <span className='border border-stone-400 px-10 py-1 rounded-md'>S/.150.00</span></p>
              <p>Descuentos totales: <span className='border border-stone-400 px-10 py-1 rounded-md'>S/.150.00</span></p>
              <p>IGV Total: <span className='border border-stone-400 px-10 py-1 rounded-md'>S/.150.00</span></p>
              <p>Precio Total: <span className='border border-stone-400 px-10 py-1 rounded-md'>S/.150.00</span></p>
            </div>
            <div className='flex flex-col gap-4 py-4 pt-10 md:flex-row justify-end'>
              <button className='btn-red-light'>Cancelar</button>
              <button className='btn-blue-dark'>Emitir comprobante</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateVoucherForm
