import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as ClipboardSVG } from '../assets/clipboard_20.svg';
import { ReactComponent as ClipboardDoneSVG } from '../assets/clipboard_done_20.svg';
// import { ReactComponent as UploaderSVG } from '../assets/tag_20.svg';
import { api } from '../configs/axios';

const wrapperAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const skeletonAnimation = keyframes`
  0% {
    background-color: #e2e3eb;
  }
  100% {
    background-color: #ebedf5;
  }
`;

const Wrapper = styled.div`
  animation: ${wrapperAnimation} 250ms ease;
`;

const ItemSkeleton = styled.div<{
  $width: number;
  $height: number;
}>`
  width: 100%;

  aspect-ratio: ${(props) => props.$width / props.$height};
  animation: ${skeletonAnimation} 1s linear infinite alternate;
`;

const ItemImageContainer = styled.div`
  width: 100%;

  position: relative;

  bottom: 0;

  overflow: hidden;
`;

const ItemImage = styled.img<{
  $isLoaded: boolean;
  $isNSFW: boolean;
}>`
  width: 100%;

  display: ${(props) => (props.$isLoaded ? 'block' : 'none')};

  transform: scale(${(props) => (props.$isNSFW ? 1.15 : 1)});

  filter: blur(${(props) => (props.$isNSFW ? 10 : 0)}px);

  transition: transform 250ms ease, filter 250ms ease;

  &:hover {
    transform: scale(1);
    filter: blur(0);
  }
`;

const ItemBottomGroup = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 0;
`;

const ItemTextGroup = styled.div`
  /* width: calc(100% - 110px); */
  width: calc(100% - 60px);
  height: 40px;

  display: flex;
  align-items: center;

  position: relative;

  overflow-y: hidden;
`;

const ItemText = styled.p<{
  $progress: number;
}>`
  width: 100%;

  position: absolute;

  visibility: ${(props) => (props.$progress === 2 ? 'hidden' : 'visible')};

  transform: translateY(
    ${(props) =>
      props.$progress === 2 ? -50 : props.$progress === 1 ? 50 : 0}px
  );

  color: var(--brightness-500);

  transition: transform 250ms ease;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemCopyStack = styled.div<{
  $backgroundColor: string;
  $color: string;
  $progress: number;
}>`
  height: 40px;

  display: flex;
  align-items: center;

  position: absolute;

  visibility: ${(props) => (props.$progress === 0 ? 'hidden' : 'visible')};

  transform: translateY(
    ${(props) =>
      props.$progress === 0
        ? -50
        : props.$progress === 1 || props.$progress === 2
        ? 0
        : 50}px
  );

  padding: 0 17.5px;

  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$color};
  border-radius: 20px;

  transition: transform 250ms ease;
`;

const ItemButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ItemButton = styled.button`
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--brightness-200);
  border-radius: 20px;

  cursor: pointer;

  & svg {
    color: var(--brightness-400);
  }
`;

const ItemCopyStackText = styled.p`
  color: var(--purple-100);
`;

export function Item({
  media,
  text,
  size,
  isNSFW,
}: {
  media: string;
  text: string;
  size: {
    width: number;
    height: number;
  };
  isNSFW: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <Wrapper>
      {!isLoaded ? (
        <ItemSkeleton $width={size.width} $height={size.height} />
      ) : undefined}
      <ItemImageContainer>
        <ItemImage
          src={media}
          alt={`${text.replace(
            /\w\S*/g,
            (text) =>
              text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
          )} GIF`}
          onLoad={() => setIsLoaded(true)}
          $isLoaded={isLoaded}
          $isNSFW={isNSFW}
        />
      </ItemImageContainer>
      <ItemBottomGroup>
        <ItemTextGroup>
          <ItemText $progress={progress}>{text.toLowerCase()}</ItemText>
          <ItemCopyStack
            $color="var(--purple-300)"
            $backgroundColor="var(--purple-100)"
            $progress={progress}
          >
            <ItemCopyStackText>Copied to Clipboard!</ItemCopyStackText>
          </ItemCopyStack>
        </ItemTextGroup>
        <ItemButtonGroup>
          <ItemButton
            title="Copy this GIF's name to Clipboard"
            onClick={() => {
              if (progress === 0) {
                navigator.clipboard.writeText(text.toLowerCase());

                if (isClicked) return;

                setIsClicked(true);
                setProgress(1);

                api
                  .put(`/update`, {
                    url: media,
                  })
                  .then(() => setIsClicked(false))
                  .catch(() => {});

                setTimeout(() => {
                  setProgress(2);
                }, 250);

                setTimeout(() => {
                  setProgress(3);
                }, 1000);

                setTimeout(() => {
                  setProgress(0);
                }, 1250);
              }
            }}
          >
            {progress === 0 || progress === 3 ? (
              <ClipboardSVG />
            ) : (
              <ClipboardDoneSVG />
            )}
          </ItemButton>
          {/* <ItemButton>
            <UploaderSVG />
          </ItemButton> */}
        </ItemButtonGroup>
      </ItemBottomGroup>
    </Wrapper>
  );
}
