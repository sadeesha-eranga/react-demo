import swal from 'sweetalert2';
import '../App.css';

export default class SwalUtils {
    
    static closeSwal() {
        swal.close();
    }
    
    static showLoadingSwal() {
        swal.fire({
            html: '<div class="loader">Loading...</div>',
            showConfirmButton: false,
            allowOutsideClick: false
        });
    }
    
    static showSuccessSwal(msg) {
        swal.fire(
            'Successful!',
            msg,
            'success'
        )
    }
    
    static showErrorSwal(msg) {
        swal.fire(
            'Error!',
            msg,
            'error'
        )
    }
    
    static showConfirmationSwal(msg) {
        return swal.fire({
            title: 'Are you sure?',
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        });
    }
}
