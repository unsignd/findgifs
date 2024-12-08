import { useEffect } from 'react';

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
        // position: 'relative',
        display: 'inline-block',
        minHeight: 300,
        // top: '50%',
        // left: '50%',
      }}
      data-ad-client={process.env.REACT_APP_ADSENSE_CID}
      data-ad-slot="4390596796"
    ></ins>
  );
}
