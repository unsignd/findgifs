import { useEffect, useRef, useState } from 'react';

export function CardUnit() {
  const unitRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      //@ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  });

  useEffect(() => {
    if (unitRef.current) {
      //@ts-ignore
      const adStatus = unitRef.current.getAttribute('data-ad-status');
      if (adStatus === 'filled') {
        // Correctly check for the filled status
        setIsLoaded(true);
      }
    }
  }, [unitRef]);

  return (
    <ins
      ref={unitRef}
      className="adsbygoogle"
      style={{
        display: isLoaded ? 'inline-block' : 'none',
        width: '100%',
        height: 'calc(100% - 60px)',
        minHeight: 300,
      }}
      data-ad-client={process.env.REACT_APP_ADSENSE_CID}
      data-ad-slot="4390596796"
      data-full-width-responsive="true"
      data-ad-format="rectangle"
    />
  );
}
