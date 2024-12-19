import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { nsfwSettingState } from '../modules/atoms';

const Ad = styled.ins<{
  $isLoaded: boolean;
  $isNSFW: boolean;
}>`
  width: calc(100% - 80px);
  height: 140px;

  max-width: 1400px;

  display: ${(props) => (props.$isNSFW ? 'none' : 'block')};

  position: relative;
  left: 50%;

  margin-top: 40px;

  transform: translateX(-50%);
  visibility: ${(props) => (props.$isLoaded ? 'visible' : 'hidden')};
`;

export function BannerUnit() {
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
    <Ad
      $isLoaded={isLoaded}
      $isNSFW={nsfwSetting}
      ref={unitRef}
      className="adsbygoogle"
      data-ad-client={process.env.REACT_APP_ADSENSE_CID}
      data-ad-slot="2834752792"
      data-full-width-responsive="horizontal"
    />
  );
}
