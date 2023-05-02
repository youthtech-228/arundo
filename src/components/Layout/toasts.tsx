import React from 'react';
import { ToastContainer } from 'react-toastify';
import Close from '@material-ui/icons/Close';
import 'react-toastify/dist/ReactToastify.css';

export const Toasts = () => {
  return <ToastContainer closeButton={<Close />} autoClose={5000} />;
};
