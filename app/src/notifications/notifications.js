import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const messageAlert = (text, icon) => {
  const MySwal = withReactContent(Swal)
  MySwal.fire({
    text,
    position: 'top-end',
    icon,
    showConfirmButton: false,
    timer: 1500
  })
}

export const notificationSuccess = (text) => {
  const MySwal = withReactContent(Swal)
  MySwal.fire({
    text,
    position: 'top-end',
    icon: 'success',
    showConfirmButton: false,
    timer: 1500
  })
}

export const notificationWarning = (text) => {
  const MySwal = withReactContent(Swal)
  MySwal.fire({
    text,
    position: 'top-end',
    icon: 'warning',
    showConfirmButton: false,
    confirmButtonColor: 'btn-yellow'
  })
}

export const notificationError = (text = 'Ocurrió un error, por favor intentelo nuevamente en unos minutos') => {
  const MySwal = withReactContent(Swal)
  MySwal.fire({
    customClass: {
      cancelButton: 'btn-red-dark'
    },
    buttonsStyling: false,
    text,
    position: 'top-end',
    icon: 'error',
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Entendido'
  })
}

export const notificationExpiedSesion = async () => {
  const MySwal = withReactContent(Swal)
  MySwal.fire({
    customClass: {
      confirmButton: 'btn-blue-dark'
    },
    buttonsStyling: false,
    title: 'Su sesión ha expidado',
    text: 'Por favor inicie sesión nuevamente',
    position: 'center',
    icon: 'info',
    confirmButtonText: 'Iniciar sesión',
    showConfirmButton: true
  })
}
