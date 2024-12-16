import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{
  $isLoaded: boolean;
}>`
  width: ${(props) => (props.$isLoaded ? '100%' : 0)};
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const AdGroup = styled.div`
  width: 100%;
  height: calc(100% - 60px);

  position: relative;
`;

const Ad = styled.ins`
  width: 100%;
  height: 100%;

  display: inline-block;

  position: absolute;
`;

const AlternativeAd = styled.div`
  width: 100%;
  height: 100%;

  display: inline-block;

  position: absolute;

  background-color: red;
`;

const ItemBottomGroup = styled.div`
  width: 100%;
  height: 60px;
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
    <Wrapper $isLoaded={isLoaded}>
      <AdGroup>
        <AlternativeAd />
        {/* <Ad
          ref={unitRef}
          className="adsbygoogle"
          data-ad-client={process.env.REACT_APP_ADSENSE_CID}
          data-ad-slot="4390596796"
          // data-full-width-responsive="true"
          data-ad-format="rectangle"
        /> */}
      </AdGroup>
      <ItemBottomGroup
        style={{
          width: '100%',
          height: 60,
        }}
      />
    </Wrapper>
  );
}
