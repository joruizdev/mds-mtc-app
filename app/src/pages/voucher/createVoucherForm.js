import { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { getRequest } from '../../services/services'
import list from './resourceFormVoucher'
import { notificationError } from '../../notifications/notifications'
// import imgLogo from './../../aseets/logo.svg'

const CreateVoucherForm = ({ rows }) => {
  const { listGoodsAndServices, listPercentageDetraction } = list

  const {
    handleSubmit,
    setValue,
    register,
    getValues,
    resetField,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '0',
      broadcastDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date().toISOString().split('T')[0],
      typevoucher: 'B'
    }
  })

  const { REACT_APP_URL_APIPERU_RUC, REACT_APP_URL_APIPERU_DNI, REACT_APP_URL_APIPERU_TOKEN } = process.env
  const [textPlaceHoldernputSearch, setTextPlaceHoldernputSearch] = useState('Nro. DNI')
  const [texTtypeVoucher, setTextTypeVoucher] = useState('BOLETA ELECTRÓNICA')
  const [serieVoucher, setSerieVoucher] = useState('B001')
  const [nroVoucher, setNroVoucher] = useState('0000004454')
  const infoDetraction = useRef()
  const infoAmountDetraction = useRef()
  const infoAmountRetention = useRef()
  const netPayable = useRef()
  const [queryTypeURL, SetQueryTypeURL] = useState(REACT_APP_URL_APIPERU_DNI)
  const [textBtnSeacrhClient, setTextBtnSeacrhClient] = useState('Buscar')
  const [selectedTypeVoucher, setSelectedTypeVoucher] = useState('B')
  const [disabledTypeDocument, setDisabledTypeDocument] = useState(false)

  useEffect(() => {
    if (selectedTypeVoucher === 'B') {
      setDisabledTypeDocument(false)
      setTextPlaceHoldernputSearch('Nro. DNI')
      setTextTypeVoucher('BOLETA ELECTRÓNICA')
      setSerieVoucher('B001')
      setNroVoucher('0000004454')
      SetQueryTypeURL(REACT_APP_URL_APIPERU_DNI)
      resetField('client')
      resetField('adress')
      resetField('city')
      resetField('dniOrRuc')
    } else {
      setDisabledTypeDocument(true)
      setValue('typedoc', 'RUC')
      setTextPlaceHoldernputSearch('Nro. RUC')
      setTextTypeVoucher('FACTURA ELECTRÓNICA')
      setSerieVoucher('F001')
      setNroVoucher('0000004521')
      SetQueryTypeURL(REACT_APP_URL_APIPERU_RUC)
      resetField('client')
      resetField('adress')
      resetField('city')
      resetField('dniOrRuc')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypeVoucher])

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
  const handleSearchClient = async () => {
    setTextBtnSeacrhClient('Buscando...')
    const DNI_OR_RUC = getValues('dniOrRuc')
    await getRequest(`${queryTypeURL}${DNI_OR_RUC}?token=${REACT_APP_URL_APIPERU_TOKEN}`)
      .then(response => {
        console.log(response)
        setTextBtnSeacrhClient('Buscar')
        setInputsValues(response)
      }).catch(error => {
        console.error(error)
        notificationError()
        setTextBtnSeacrhClient('Buscar')
      })
  }

  const onSubmit = async data => {
  }

  const setInputsValues = (data) => {
    if (selectedTypeVoucher === 'B') {
      setValue('client', `${data.apellidoPaterno} ${data.apellidoMaterno} ${data.nombres}`)
    } else {
      setValue('client', data.razonSocial)
      setValue('adress', data.direccion)
      setValue('city', `${data.distrito} - ${data.provincia} - ${data.departamento}`)
    }
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
        <div className='flex justify-between pb-5'>
          <div className='flex'>
            <div className='flex flex-col p-4 text-lg'>
              <p className='font-bold'>MEDICOS SALUD UNION EN ALERTA S.A.C</p>
              <p>Calle Albert Einstein Mz. H Lote 22 Urb. La Calera de la Merced</p>
              <p>Surquillo - Lima - Lima</p>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center border border-mds-yellow rounded-md p-4 h-full text-xl'>
            <p>RUC: 20491987368</p>
            <p className='font-bold'>{texTtypeVoucher}</p>
            <p>#{serieVoucher + '-' + nroVoucher}</p>
          </div>
        </div>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-12 md:col-span-6 lg:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Tipo de comprobante</span>
              <select
                className='input-select'
                onChangeCapture={e => setSelectedTypeVoucher(e.target.value)}
                defaultValue='B'
                {...register('typevoucher', {
                  required: true
                })}
              >
                <option value='B'>Boleta</option>
                <option value='F'>Factura</option>
              </select>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Tipo de documento</span>
              <select
                className='input-select'
                disabled={disabledTypeDocument}
                {...register('typedoc', {
                  required: true
                })}
              >
                <option value='L.E / DNI'>L.E / DNI</option>
                <option value='CE'>CE</option>
                <option value='RUC'>RUC</option>
                <option value='Pasaporte'>Pasaporte</option>
                <option value='P. Nacimiento'>P. Nacimiento</option>
                <option value='Otros'>Otros</option>
              </select>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Nro de documento</span>
              <div className='flex'>
                <input
                  type='text'
                  className='input-text border-r-0 rounded-r-none'
                  placeholder={textPlaceHoldernputSearch}
                  {...register('dniOrRuc', {
                    required: true,
                    maxLength: 11
                  })}
                />
                <input type='button' className='my-1 rounded-l-none btn-blue-dark cursor-pointer' value={textBtnSeacrhClient} onClick={handleSearchClient} />
              </div>

              {errors?.dniOrRuc?.type === 'required' && <p className='text-red-500 text-sm'>Este campo es requerido</p>}
              {errors?.dniOrRuc?.type === 'maxLength' && <p className='text-red-500 text-sm'>Ingrese un nro válido</p>}
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Cliente</span>
              <input
                type='email'
                className='input-text'
                {...register('client')}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Dirección</span>
              <input
                type='text'
                className='input-text'
                {...register('adress', {
                  required: true
                })}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Cuidad</span>
              <input
                type='text'
                className='input-text'
                readOnly
                {...register('city', {
                  required: true
                })}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Email</span>
              <input
                type='email'
                className='input-text'
                {...register('email', {
                  required: true
                })}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Fecha emisión</span>
              <input
                type='date'
                className='input-date'
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('broadcastdate', {
                  required: true
                })}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Fecha vencimiento</span>
              <input
                type='date'
                className='input-date'
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('expirationdate', {
                  required: true
                })}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Moneda</span>
              <select
                className='input-select pt-2'
                {...register('currency', {
                  required: true
                })}
              >
                <option value='soles'>Soles</option>
                <option value='dolares'>Dólares</option>
              </select>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Condición de pago</span>
              <input
                type='text'
                className='input-text'
                {...register('paymentcondition')}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Orden de compra</span>
              <input
                type='text'
                className='input-text'
                {...register('purchaseorder')}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:order-11'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700'>Guía de remisión</span>
              <input
                type='text'
                className='input-text'
                {...register('referralguide')}
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-6 md:order-11'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-700 mb-1'>Adjuntar archivo</span>
              <input
                type='file'
                className='block w-full text-sm bg-gray-50 rounded-md border border-gray-300 cursor-pointer focus:outline-none file:py-1.5 file:border-0 file:bg-mds-blue file:text-white file:px-4'
                {...register('attached')}
              />
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
          <input
            type='text'
            className='input-text'
            {...register('observations')}
          />
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
                <input
                  type='text'
                  className='border border-stone-400 rounded-md px-2 w-20'
                  {...register('discount')}
                />
                <select
                  className='border border-stone-400 rounded-md px-2 w-20'
                  {...register('retention')}
                >
                  <option>0 %</option>
                  <option>3 %</option>
                  <option>6 %</option>
                </select>
                <select
                  className='border border-stonec-400 rounded-md px-2 w-20'
                  {...register('detraction')}
                >
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
                <select
                  className='border border-stone-400 rounded-md px-2 py-1 w-full lg:w-96'
                  {...register('detractioncode')}
                >
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
              <p>Subtotal: S/. <span className='border border-stone-400 px-10 py-1 rounded-md'>150.00</span></p>
              <p>Descuentos totales: S/. <span className='border border-stone-400 px-10 py-1 rounded-md'>150.00</span></p>
              <p>IGV Total: S/. <span className='border border-stone-400 px-10 py-1 rounded-md'>150.00</span></p>
              <p>Precio Total: S/. <span className='border border-stone-400 px-10 py-1 rounded-md'>150.00</span></p>
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
