import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as ClipboardSVG } from '../assets/clipboard_20.svg';
import { ReactComponent as ClipboardDoneSVG } from '../assets/clipboard_done_20.svg';
// import { ReactComponent as UploaderSVG } from '../assets/tag_20.svg';
import { useRecoilState } from 'recoil';
import { loadedContentState } from '../modules/atoms';
import { api } from '../configs/axios';
import toast from 'react-hot-toast';

const Wrapper = styled.div<{
  $isLoaded: boolean;
}>`
  transition: opacity 100ms ease;

  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
`;

const ItemImage = styled.img<{
  $isLoaded: boolean;
}>`
  width: 100%;

  position: relative;

  bottom: 0;

  transition: opacity 250ms ease;

  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
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

export function Item({
  media,
  text,
}: // uploader,
{
  media: string;
  text: string;
  // uploader?: string;
}) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [loadedContents, setLoadedContents] =
    useRecoilState(loadedContentState);

  const imageRef: {
    current: any;
  } = useRef(null);

  useEffect(() => {
    if (loadedContents === -1) {
      setIsLoaded(true);
    }
  }, [loadedContents]);

  return (
    <Wrapper $isLoaded={isLoaded}>
      <ItemImage
        src={media}
        loading="lazy"
        onLoad={() => {
          if (loadedContents !== -1) {
            setLoadedContents(loadedContents + 1);
          }
        }}
        $isLoaded={isLoaded}
        ref={imageRef}
      />
      <ItemBottomGroup>
        <ItemTextGroup>
          <ItemText $progress={progress}>{text.toLowerCase()}</ItemText>
          <ItemCopyStack
            $color="var(--purple-300)"
            $backgroundColor="var(--purple-100)"
            $progress={progress}
          >
            <p>Copied to Clipboard!</p>
          </ItemCopyStack>
        </ItemTextGroup>
        <ItemButtonGroup>
          <ItemButton
            onClick={() => {
              if (progress === 0) {
                navigator.clipboard.writeText(text);

                if (isClicked) return;

                setIsClicked(true);
                setProgress(1);

                api
                  .put(`/update/upvote`, {
                    url: media,
                  })
                  .then(() => setIsClicked(false))
                  .catch(() =>
                    toast.error(
                      "An error occured while updating GIF's priority."
                    )
                  );

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
