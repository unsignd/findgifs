import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;

  position: relative;

  bottom: 0;
`;

export function CardUnit() {
  useEffect(() => {
    try {
      //@ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  });

  return (
    <Container>
      <ins
        className="adsbygoogle"
        style={{
          // position: 'relative',
          display: 'inline-block',
          width: '100%',
          height: '100%',
          minHeight: 300,
          // top: '50%',
          // left: '50%',
        }}
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="4390596796"
      ></ins>
    </Container>
  );
}
