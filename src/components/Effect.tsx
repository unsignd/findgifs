import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { effectActiveState } from '../modules/atoms';

const Wrapper = styled.div<{
  $active: boolean;
}>`
  width: 100%;
  height: 100%;

  position: absolute;

  backdrop-filter: blur(90px);
  opacity: ${(props) => (props.$active ? 0.9 : 0)};

  transition: opacity 100ms ease;

  pointer-events: none;
  z-index: 2;
`;

export function Effect() {
  const [effectActive] = useRecoilState(effectActiveState);

  return <Wrapper $active={effectActive} />;
}
