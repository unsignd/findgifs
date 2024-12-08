import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: calc(100% - 60px);

  display: flex;
  align-items: center;
  justify-content: center;
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
          display: 'inline-block',
          width: '100%',
          height: '100%',
        }}
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="4390596796"
      ></ins>
    </Container>
  );
}
