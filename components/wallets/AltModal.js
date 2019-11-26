// The name of this file is a placeholder; feel free to change it

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LedgerType from './LedgerType';
import HardwareAccountSelect from './HardwareAccountSelect';
import { BasicModal } from './templates';
import { AccountTypes } from '../../utils/constants';

const TREZOR_PATH = "44'/60'/0'/0/0";

export function LedgerAltModal({ show, onClose, onAccountChosen }) {
  const [path, setPath] = useState();

  // you can change the default state to test the rendering of different steps
  const [step, setStep] = useState(0);

  if (!show) return null;

  const showNextStep = path => {
    setPath(path);
    setStep(1);
  };

  return (
    <ModalWrapper onClose={onClose}>
      {({ onClose }) =>
        [
          () => <LedgerType onClose={onClose} onPathSelect={showNextStep} />,
          () => (
            <HardwareAccountSelect
              onClose={onClose}
              path={path}
              type={AccountTypes.LEDGER}
              confirmAddress={address =>
                onAccountChosen(address, AccountTypes.LEDGER)
              }
            />
          )
        ][step]()
      }
    </ModalWrapper>
  );
}

export function TrezorAltModal({ show, onClose, onAccountChosen }) {
  if (!show) return null;
  return (
    <ModalWrapper onClose={onClose}>
      {({ onClose }) => (
        <HardwareAccountSelect
          onClose={onClose}
          path={TREZOR_PATH}
          type={AccountTypes.TREZOR}
          confirmAddress={address =>
            onAccountChosen(address, AccountTypes.TREZOR)
          }
        />
      )}
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector('#modal');
    setMounted(true);
  }, []);

  return (
    mounted &&
    createPortal(
      <BasicModal show onClose={onClose}>
        {children}
      </BasicModal>,
      ref.current
    )
  );
}
