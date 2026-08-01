import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);

  const showInfo = useCallback((message) => {
    toast(message);
  }, []);

  const showLoading = useCallback((message) => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    dismiss,
  };
};