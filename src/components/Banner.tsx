import styled from 'styled-components';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useRecoilState } from 'recoil';
import { gifListState } from '../modules/atoms';
import { useEffect, useState } from 'react';
import { api } from '../configs/axios';

const Wrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: 100%;
  height: 360px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: ${(props) =>
    props.$isMobile ? '140px 20px 0 20px' : '80px 40px 0 40px'};

  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.7) 90%,
      #fff 100%
    ),
    linear-gradient(
      90deg,
      #fff 0%,
      rgba(255, 255, 255, 0.7) 10%,
      rgba(255, 255, 255, 0) 20%,
      rgba(255, 255, 255, 0) 80%,
      rgba(255, 255, 255, 0.7) 90%,
      #fff 100%
    ),
    linear-gradient(
      0deg,
      rgba(165, 169, 184, 0.04) 0%,
      rgba(255, 255, 255, 0) 50%
    ),
    linear-gradient(
      262deg,
      rgba(255, 255, 255, 0.06) 43.66%,
      rgba(151, 116, 255, 0.06) 100%
    ),
    linear-gradient(
      88deg,
      rgba(255, 255, 255, 0.04) 1.53%,
      rgba(151, 116, 255, 0.04) 98.47%
    ),
    linear-gradient(
      264deg,
      rgba(94, 18, 235, 0) 0%,
      rgba(235, 18, 161, 0.02) 18.39%,
      rgba(94, 18, 235, 0.02) 42.91%,
      rgba(94, 18, 235, 0) 61.3%
    ),
    linear-gradient(
      94deg,
      rgba(94, 18, 235, 0) 23.82%,
      rgba(94, 18, 235, 0.02) 41.98%,
      rgba(235, 18, 161, 0.02) 66.2%,
      rgba(94, 18, 235, 0) 84.36%
    ),
    linear-gradient(
      285deg,
      rgba(218, 18, 235, 0) 25.93%,
      rgba(218, 18, 235, 0.02) 48.63%,
      rgba(218, 18, 235, 0) 71.52%
    );
  border-bottom: 1px solid var(--brightness-200);
`;

const TextGroup = styled.div`
  width: 100%;
  max-width: 1400px;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Subheading = styled.p<{
  $isMobile?: boolean;
}>`
  text-align: ${(props) => (props.$isMobile ? 'center' : 'start')};

  color: var(--brightness-400);
`;

const Heading = styled.h1<{
  $isMobile?: boolean;
}>`
  text-align: ${(props) => (props.$isMobile ? 'center' : 'start')};

  font-size: ${(props) => (props.$isMobile ? 26 : 34)}px;
  font-weight: 700;
  letter-spacing: -0.32px;
  white-space: pre-wrap;

  color: var(--brightness-500);
`;

export function Banner() {
  const { width } = useWindowDimensions();

  const [size, setSize] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      setSize(await api.get(`/size`).then((res) => res.data.data));
    };

    fetchData();
  }, []);

  return (
    <Wrapper $isMobile={width <= 1040}>
      <TextGroup>
        <Subheading $isMobile={width <= 1040}>
          Get {size} trending Giphy GIFs all for free
        </Subheading>
        <Heading $isMobile={width <= 1040}>
          Easy-to-use GIF finder,{'\n'}contributed by users all around the
          world.
        </Heading>
      </TextGroup>
    </Wrapper>
  );
}
