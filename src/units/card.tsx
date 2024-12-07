import { useEffect } from 'react';
import styled from 'styled-components';

const AdWrapper = styled.div`
  width: 100% !important;
  height: calc(100% - 60px) !important;
  min-height: 300px;
`;

const Ad = styled.ins`
  width: 100%;
  height: calc(100% - 60px);
  display: block;
`;

export function CardUnit() {
  useEffect(() => {
    try {
      //@ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  });

  return (
    <AdWrapper>
      {/* <Ad
        className="adsbygoogle"
        data-ad-format="fluid"
        data-ad-layout-key="+1m+s0-k-t+3t"
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="4390596796"
      ></Ad> */}
      <ins
        className="adsbygoogle"
        style={{
          display: 'inline-block',
          width: 160,
          height: 600,
        }}
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="4390596796"
        data-full-width-responsive="true"
        data-ad-format="vertical"
      ></ins>
    </AdWrapper>
  );
}
