import styled from 'styled-components';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useRecoilState } from 'recoil';
import { effectActiveState } from '../modules/atoms';
import { useState } from 'react';

const Wrapper = styled.div`
  width: 100%;
  height: 80px;

  display: flex;
  justify-content: center;

  position: absolute;
  bottom: 0;

  background-color: var(--brightness-100);
  border-top: 1px solid var(--brightness-200);
`;

const ContentGroup = styled.div<{
  $isMobile?: boolean;
}>`
  width: calc(100% - ${(props) => (props.$isMobile ? 40 : 80)}px);
  height: 100%;

  max-width: 1400px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Text = styled.p`
  font-size: 14px;

  color: var(--brightness-400);
`;

const Watermark = styled.img`
  height: 16px;

  cursor: pointer;
`;

const LinkText = styled.span`
  font-size: 14px;

  color: var(--brightness-400);

  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-decoration-color: var(--brightness-400);
  }
`;

export function Footer() {
  const { width } = useWindowDimensions();

  const [isFreaky] = useState<boolean>(Math.random() <= 0.01);

  const [effectActive, setEffectActive] = useRecoilState(effectActiveState);

  return (
    <Wrapper>
      <ContentGroup $isMobile={width <= 1202}>
        {isFreaky ? (
          <LinkText onClick={() => setEffectActive(!effectActive)}>
            {effectActive ? 'Be Normal (lame)' : 'Go Freaky 😝'}
          </LinkText>
        ) : (
          <Text>© {new Date().getFullYear()} FindGIFs</Text>
        )}
        <Watermark
          src={require('../assets/watermark.png')}
          onClick={() => window.open('https://giphy.com', '_blank')}
        />
      </ContentGroup>
    </Wrapper>
  );
}
