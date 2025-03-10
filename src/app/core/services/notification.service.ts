import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /** 🔹 Mostrar alerta de éxito */
  showSuccess(message: string, title: string = 'Éxito') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  }

  /** 🔹 Mostrar alerta de error */
  showError(message: string, title: string = 'Error') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  /** 🔹 Mostrar alerta de advertencia */
  showWarning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  /** 🔹 Mostrar alerta informativa */
  showInfo(message: string, title: string = 'Información') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  /** 🔹 Mostrar confirmación antes de realizar una acción */
  showConfirmation(title: string, message: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then(result => result.isConfirmed);
  }
}
