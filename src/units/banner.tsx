import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;

  display: flex;
  justify-content: center;

  padding-top: 40px;
`;

const Ad = styled.ins<{
  $isLoaded: boolean;
}>`
  width: calc(100% - 80px);

  display: block;

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
    <Wrapper>
      <Ad
        $isLoaded={isLoaded}
        ref={unitRef}
        className="adsbygoogle"
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="2834752792"
        data-full-width-responsive="horizontal"
        data-ad-format="rectangle"
      />
    </Wrapper>
  );
}
