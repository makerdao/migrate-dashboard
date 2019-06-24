import styled from 'styled-components'

const FadeInFromSide = styled.div`
  opacity: 0;
  top: 0;
  position: absolute;
  pointer-events: none;

  ${props =>
    props.active &&
    `
    transform: translateX(0);
    transition: all 0.7s;
    position: relative;
    opacity: 1;
    pointer-events: unset;
  `}

  ${props =>
    props.toLeft &&
    `
    opacity: 0;
    transform: translateX(-50px);
  `}

  ${props =>
    props.toRight &&
    `
    opacity: 0;
    transform: translateX(50px);
  `}
`;

export default FadeInFromSide
