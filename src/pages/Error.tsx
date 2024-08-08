import styled from 'styled-components';
import useWindowDimensions from '../hooks/useWindowDimensions';

const Wrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: 100%;
  height: calc(100vh - 80px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding-top: ${(props) => (props.$isMobile ? 140 : 80)}px;
`;

export function Error() {
  const { width } = useWindowDimensions();

  return <Wrapper $isMobile={width <= 1040}>error page!!!</Wrapper>;
}
