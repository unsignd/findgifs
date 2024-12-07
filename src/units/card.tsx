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

export function CardUnit() {
  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5188419011494703"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client="ca-pub-5188419011494703"
        data-ad-slot="4390596796"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </>
  );
}
