import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Grow from '@mui/material/Grow';
import s from './styles.module.scss';

export interface IAppModalProps {
  children: React.ReactNode;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  outsideClose?: boolean;
  onClose?(): void;
}

export interface IAppModalRef {
  open: () => void;
  close: () => void;
}

const AppModal = forwardRef<IAppModalRef, IAppModalProps>((props, ref) => {
  const {
    children,
    ariaLabelledby = '',
    ariaDescribedby = '',
    outsideClose = false,
    onClose = () => {},
  } = props;
  const [modalState, setModalState] = useState(false);

  const open = () => setModalState(true);
  const close = () => {
    setModalState(false);
    onClose();
  };

  useImperativeHandle(ref, () => ({ open, close }));

  const stopPropagation = (e: React.FormEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Modal
      open={modalState}
      onClose={close}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Grow in={modalState}>
        <div
          className={s['modal-wrapper']}
          onClick={() => {
            if (outsideClose) close();
          }}
        >
          <div className={s['modal-content']} onClick={stopPropagation}>
            {children}
          </div>
        </div>
      </Grow>
    </Modal>
  );
});

AppModal.displayName = 'AppModal';

export default AppModal;
