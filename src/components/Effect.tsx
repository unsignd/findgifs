import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { effectActiveState } from '../modules/atoms';
import { useEffect, useState } from 'react';

const Wrapper = styled.div<{
  $active: boolean;
  $intense: number;
}>`
  width: 100%;
  height: 100%;

  position: absolute;

  backdrop-filter: blur(${(props) => props.$intense / 100}px)
    saturate(${(props) => props.$intense})
    contrast(${(props) => props.$intense + 100}%);
  opacity: ${(props) => (props.$active ? 0.9 : 0)};

  transition: opacity 100ms ease;

  pointer-events: none;
  z-index: 2;
`;

export function Effect() {
  const [intense, setIntense] = useState<number>(0);
  const [event, setEvent] = useState<NodeJS.Timeout>();

  const [effectActive] = useRecoilState(effectActiveState);

  useEffect(() => {
    if (effectActive) {
      setIntense(0);

      if (event) {
        clearInterval(event);
      }

      setEvent(
        setInterval(() => {
          setIntense((intense) => intense + 10);
        }, 100)
      );
    }

    return () => {
      if (event) {
        clearInterval(event);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectActive]);

  return <Wrapper $active={effectActive} $intense={intense} />;
}
