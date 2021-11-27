import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toastify = {
  success(message) {
    return Toastify({
      text: message,
      duration: 2000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#4caf50    ',
      },
    }).showToast();
  },
  info(message) {
    return Toastify({
      text: message,
      duration: 2000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#00b0ff',
      },
    }).showToast();
  },
  error(message) {
    return Toastify({
      text: message,
      duration: 2000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#d32f2f',
      },
    }).showToast();
  },
};
