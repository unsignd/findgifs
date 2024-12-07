import { useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
`;

export function CardUnit() {
  useEffect(() => {
    try {
      //@ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  });

  return (
    <Wrapper>
      <ins
        className="adsbygoogle"
        style={{
          position: 'absolute',
          display: 'inline-block',
          width: 'inherit',
          maxWidth: 'inherit',
          height: 'calc(100% - 60px)',
          minHeight: 300,
        }}
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="4390596796"
        data-full-width-responsive="true"
        data-ad-format="rectangle"
      />
    </Wrapper>
  );
}
