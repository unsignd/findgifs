import { useEffect } from 'react';
import styled from 'styled-components';

export function CardUnit() {
  useEffect(() => {
    try {
      //@ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  });

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'inline-block',
        width: '100%',
        height: 'calc(100% - 60px)'
        minHeight: 300,
      }}
      data-ad-client={process.env.REACT_APP_ADSENSE_CID}
      data-ad-slot="4390596796"
      data-full-width-responsive="true"
      data-ad-format="rectangle"
    ></ins>
  );
}
