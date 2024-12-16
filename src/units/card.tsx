import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const Ad = styled.ins<{
  $isLoaded: boolean;
}>`
  width: 100%;

  max-height: calc(100% - 60px);
  min-height: 300px;

  display: inline-block;

  visibility: ${(props) => (props.$isLoaded ? 'visible' : 'hidden')};
`;

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
    <Wrapper>
      <Ad
        $isLoaded={isLoaded}
        ref={unitRef}
        className="adsbygoogle"
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="4390596796"
        // data-full-width-responsive="true"
        data-ad-format="rectangle"
      />
      <div
        style={{
          width: '100%',
          height: 60,
        }}
      />
    </Wrapper>
  );
}
