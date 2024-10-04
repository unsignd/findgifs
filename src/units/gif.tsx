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

export function GifUnit() {
  return (
    <AdWrapper>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.REACT_APP_ADSENSE_CID}`}
        crossOrigin="anonymous"
      ></script>
      <Ad
        className="adsbygoogle"
        data-ad-client={process.env.REACT_APP_ADSENSE_CID}
        data-ad-slot="1259243448"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></Ad>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </AdWrapper>
  );
}
