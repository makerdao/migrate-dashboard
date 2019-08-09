import { useContext } from 'react';
import { WalletStateContext } from '../providers/WalletProvider';

function useWallet() {
  const context = useContext(WalletStateContext);
  const { show, reset } = context;
  const showByType = modalType => show({ modalType });
  return { show, reset, showByType };
}

export default useWallet;
