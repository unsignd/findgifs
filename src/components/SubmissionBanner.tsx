import styled from 'styled-components';
import useWindowDimensions from '../hooks/useWindowDimensions';

const Wrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding-top: ${(props) => (props.$isMobile ? 140 : 80)}px;

  background-color: var(--yellow-100);
  background-clip: content-box;
`;

const Text = styled.p`
  padding: 10.5px 40px;

  text-align: center;

  color: var(--yellow-300);
`;

export function SubmissionBanner() {
  const { width } = useWindowDimensions();

  return (
    <Wrapper $isMobile={width <= 1202}>
      <Text>
        Unverified submissions are displayed here. Upvote to influence GIFs'
        priorities.
      </Text>
    </Wrapper>
  );
}
