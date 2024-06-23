import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useWindowDimensions from '../hooks/useWindowDimensions';

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

  &:hover {
    text-decoration: underline;
    text-decoration-color: var(--brightness-400);
  }
`;

export function Footer() {
  const { width } = useWindowDimensions();

  return (
    <Wrapper>
      <ContentGroup $isMobile={width <= 1040}>
        <Text>© 2024 FindGIFs</Text>
        <LinkGroup>
          <Link to={'https://github.com/unsignd/findgifs'}>
            <LinkText>Github</LinkText>
          </Link>
          <Link to={'https://instagram.com/find.gifs'}>
            <LinkText>Instagram</LinkText>
          </Link>
        </LinkGroup>
      </ContentGroup>
    </Wrapper>
  );
}
