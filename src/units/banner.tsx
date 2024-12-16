import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Ad = styled.ins<{
  $isLoaded: boolean;
}>`
  width: 1400px;
  height: 140px;

  display: block;

  position: relative;
  left: 50%;

  padding-top: 40px;

  transform: translateX(-50%);
  visibility: ${(props) => (props.$isLoaded ? 'visible' : 'hidden')};
`;

export function BannerUnit() {
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
    <Ad
      $isLoaded={isLoaded}
      ref={unitRef}
      className="adsbygoogle"
      data-ad-client={process.env.REACT_APP_ADSENSE_CID}
      data-ad-slot="2834752792"
      data-full-width-responsive="horizontal"
    />
  );
}
