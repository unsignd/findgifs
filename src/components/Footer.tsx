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

const LinkGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const LinkText = styled.p`
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
      <ContentGroup $isMobile={width <= 1040}>
        <Text>© {new Date().getFullYear()} FindGIFs</Text>
        <LinkGroup>
          <a
            href="https://github.com/unsignd/findgifs"
            target="_blank"
            rel="noreferrer"
          >
            <LinkText>Github</LinkText>
          </a>
          <a
            href="https://instagram.com/_findgifs"
            target="_blank"
            rel="noreferrer"
          >
            <LinkText>Instagram</LinkText>
          </a>
          {isFreaky ? (
            <LinkText onClick={() => setEffectActive(!effectActive)}>
              {effectActive ? 'Be Normal (lame)' : 'Go Freaky 😝'}
            </LinkText>
          ) : undefined}
        </LinkGroup>
      </ContentGroup>
    </Wrapper>
  );
}
