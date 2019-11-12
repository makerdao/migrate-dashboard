import React from 'react'
import styled, { keyframes } from 'styled-components';
import { Grid, Box } from '@makerdao/ui-components-core'

const Keyframe = keyframes`
  {
    0% {
      left: 0;
    }
    50% {
      left: 114px;
    }
    100% {
      left: 0;
    }
  }
`
const Path = styled.div`
  position: relative;
  overflow: hidden;
  width: 160px;
  height: 2px;
  background-color: #c4c4c4;
  margin: auto;
`;

const Element = styled.span`
  position: absolute;
  left: 0;
  background-color: #E67002;
  width: 46px;
  height: 2px;
  display: block;
  top: 0;
  animation: ${Keyframe} 3.0s ease 3.0s infinite;
`;

export default () => {
  return <Path>
    <Element />
  </Path>
}
