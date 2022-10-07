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
