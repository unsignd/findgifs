import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { nsfwSettingState } from '../modules/atoms';
import { useRecoilState } from 'recoil';

const Wrapper = styled.div<{
  $isNSFW: boolean;
}>`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.$isNSFW ? 'none' : 'flex')};
  flex-direction: column;
`;

const Ad = styled.ins<{
  $isLoaded: boolean;
}>`
  width: 100%;
  max-height: calc(100% - 60px);
  min-height: 300px;
  height: calc(100% - 60px);
  display: inline-block;
  visibility: ${(props) => (props.$isLoaded ? 'visible' : 'hidden')};
`;

export function CardUnit() {
  const unitRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [nsfwSetting] = useRecoilState(nsfwSettingState);

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
    <Wrapper $isNSFW={nsfwSetting}>
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
