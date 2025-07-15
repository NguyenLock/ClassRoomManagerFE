import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProps } from '../../../types';


export const ToastComponent = ({
  position = 'top-right',
  autoClose = 3000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = true,
}: ToastProps) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      closeOnClick={closeOnClick}
      pauseOnHover={pauseOnHover}
      draggable={draggable}
    />
  );
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, options);
  },
}; 