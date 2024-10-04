import styled from 'styled-components';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Wrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: calc(100% - ${(props) => (props.$isMobile ? 40 : 80)}px);
  height: 100vh;

  max-width: 1400px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  left: 50%;
  transform: translateX(-50%);

  padding: 40px 0;
`;

const NotFoundGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const NotFoundText = styled.p`
  text-align: center;
  white-space: pre-line;

  color: var(--brightness-400);

  & a {
    text-decoration: underline;
  }
`;

export function Error() {
  const { width } = useWindowDimensions();

  const [randomNumber] = useState<number>(Math.floor(Math.random() * 6));

  return (
    <Wrapper $isMobile={width <= 1202}>
      <NotFoundGroup>
        <iframe
          width="240"
          height="135"
          src={`https://www.youtube.com/embed/${
            [
              'aQrsDSaRo3c',
              'MWS_qYAv0Ew',
              'Zl_z-07JNow',
              '1KDhwwXf0zA',
              'D2FonrL_h40',
              '1Cb4VWkYp_I',
            ][randomNumber]
          }`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          frameBorder="none"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          draggable="false"
        />
        <NotFoundText>
          Hey dude u took the wrong way
          {'\n'}u can <Link to="/">go back</Link> or watch the freaky alpha wolf
          video above
        </NotFoundText>
      </NotFoundGroup>
    </Wrapper>
  );
}
