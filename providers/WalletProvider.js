import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll
} from 'body-scroll-lock';
import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { wallets, templates } from '../components/wallets';

function resolveModalTypeToComponent(modals, type) {
  if (!modals || !type || !modals[type]) return null;

  return modals[type];
}

const initialState = {
  modalType: '',
  modalProps: {},
  modalTemplate: ''
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, ...payload };
    case 'reset':
      return { ...initialState };
    default:
      return;
  }
};

export const WalletStateContext = createContext(initialState);

function WalletProvider({ children }) {
  const ref = useRef();
  const [{ modalType, modalTemplate, modalProps }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const shouldShow = !!modalType;

  const reset = () => {
    if (ref && ref.current) enableBodyScroll(ref.current);
    dispatch({ type: 'reset' });
  };

  const show = ({ modalType, modalProps, modalTemplate }) => {
    if (ref && ref.current) disableBodyScroll(ref.current);
    dispatch({
      type: 'show',
      payload: { modalType, modalProps, modalTemplate }
    });
  };

  useEffect(() => {
    return () => clearAllBodyScrollLocks();
  }, []);

  const ModalTemplateComponent = templates[modalTemplate] || templates.default;

  return (
    <WalletStateContext.Provider value={{ show, reset }}>
      <div ref={ref}>
        <ModalTemplateComponent
          show={shouldShow}
          onClose={reset}
          modalProps={modalProps}
        >
          {resolveModalTypeToComponent(wallets, modalType)}
        </ModalTemplateComponent>
      </div>
      {children}
    </WalletStateContext.Provider>
  );
}

export default WalletProvider;
