import { toast } from 'react-toastify';
import classNames from 'classnames';
import './messages.scss';

export const toastType =
  (which) =>
  (msg, config = {}) => {
    let payload = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    let bodyClassName = classNames(
      typeof msg === 'object' ? 'object' : 'basic',
      payload.length > 100 && 'small'
    );

    return toast[which](
      payload,
      Object.assign(
        {
          autoDismiss: true,
          position: toast.POSITION.BOTTOM_RIGHT,
          progressClassName: 'toast-progress',
          bodyClassName,
        },
        config
      )
    );
  };

export const success = toastType('success');
export const warning = toastType('warning');
export const info = toastType('info');
export const error = toastType('error');

export const message = {
  success,
  warning,
  info,
  error,
};
