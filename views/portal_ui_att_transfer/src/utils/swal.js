import Swal from 'sweetalert2';

export const swalToast = (icon, title) => {
  Toast.fire({
    icon,
    title
  });
};

export const swalInfoChooseText = async (text) => {
  return Swal.fire({
    icon: 'info',
    title: text,
    confirmButtonText: 'Xác nhận',
    showCancelButton: true,
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else {
      return null;
    }
  });
};

export const swalTextArea = async (title, inputLabel, inputPlaceholder) => {
  const { value: text } = await Swal.fire({
    title,
    input: 'textarea',
    inputLabel,
    inputPlaceholder,
    confirmButtonText: 'Xác nhận',
    showCancelButton: true,
    cancelButtonText: 'Hủy'
  });
  if (text) {
    return text;
  } else {
    return null;
  }
};

export const swalInputPass = async (title, inputLabel, inputPlaceholder) => {
  const { value: password } = await Swal.fire({
    title,
    input: 'password',
    inputLabel,
    inputPlaceholder,
    confirmButtonText: 'Xác nhận',
    showCancelButton: true,
    cancelButtonText: 'Hủy',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off',
      autocomplete: 'off'
    }
  });
  if (password) {
    return password;
  } else {
    return null;
  }
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
