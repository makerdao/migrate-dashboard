import React from 'react';
import styled, { keyframes } from 'styled-components';
import useStore from '../hooks/useStore';
import { parseError } from '../utils/misc';

export const Container = styled.div`
  position: fixed;
  top: 12px;
  right: 0;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 256px;
  background: transparent;
  pointer-events: none;
  z-index: 10000000000;
`;

const toastFade = keyframes`
  0% {
    opacity: 0;
    top: 8px;
  }
  5% {
    opacity: 1;
    top: 0;
  }
  95% {
    opacity: 1;
    top: 0;
  }
  100% {
    opacity: 0;
    top: -4px;
  }
`;

const Toast = styled.div`
  z-index: 10000000000;
  border-radius: 4px;
  padding: 8px 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 16px;
  line-height: 1.4;
  display: block;
  margin-bottom: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  position: relative;
  animation-duration: 7s;
  animation-fill-mode: forwards;
  animation-name: ${toastFade};
  animation-timing-function: linear;
`;

export const ErrorToast = styled(Toast)`
  background-color: #c21f3a;
  word-wrap: break-word;
  background-image: radial-gradient(
    ellipse farthest-corner at top left,
    #e2197a 0%,
    #c21f3a 100%
  );
`;

const addToast = message => {
  return {
    type: 'assign',
    payload: {
      toast: {
        message
      }
    }
  };
};

const removeToast = () => {
  return { type: 'assign', payload: { toast: {} } };
};

export const addToastWithTimeout = (_message, dispatch) => {
  const message = parseError(_message);
  dispatch(addToast(message));
  setTimeout(() => {
    dispatch(removeToast());
  }, 7500);
};

const Toasts = () => {
  const [{ toast }] = useStore();
  console.log(toast, 'toast toast');
  if (!toast) return <span />;
  return (
    <Container>
      <ErrorToast>{toast.message}</ErrorToast>
    </Container>
  );
};

export default Toasts;
