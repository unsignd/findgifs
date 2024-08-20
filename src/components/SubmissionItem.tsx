import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as UpvoteSVG } from '../assets/upvote_20.svg';
import { useRecoilState } from 'recoil';
import { loadedContentState } from '../modules/atoms';
import { api } from '../configs/axios';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

const Wrapper = styled.div`
  transition: opacity 100ms ease;
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
  width: 100%;
  height: 40px;

  display: flex;
  align-items: center;

  position: relative;

  overflow-y: hidden;
`;

const ItemText = styled.p`
  width: 100%;

  position: absolute;

  padding-right: 20px;

  color: var(--brightness-500);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ItemButton = styled.button<{
  $isUpvoted: boolean;
}>`
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 0 17.5px;

  background-color: ${(props) =>
    props.$isUpvoted ? 'var(--purple-100)' : 'var(--brightness-200)'};
  border-radius: 20px;

  transition: background-color 250ms ease;

  cursor: pointer;

  & svg path {
    fill: ${(props) =>
      props.$isUpvoted ? 'var(--purple-300)' : 'var(--brightness-400)'};

    transition: fill 250ms ease;
  }

  & p {
    margin-top: -1px;

    color: ${(props) =>
      props.$isUpvoted ? 'var(--purple-300)' : 'var(--brightness-400)'};

    transition: color 250ms ease;
  }
`;

export function SubmissionItem({
  index,
  media,
  text,
  upvote,
  isUpvoted,
}: {
  index: number;
  media: string;
  text: string;
  upvote: number;
  isUpvoted: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [upvoted, setUpvoted] = useState<boolean>(isUpvoted);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [loadedContents, setLoadedContents] =
    useRecoilState(loadedContentState);

  useEffect(() => {
    if (
      loadedContents[Math.floor(index / 5)].current >=
      loadedContents[Math.floor(index / 5)].maximum
    ) {
      setIsLoaded(true);
    }
  }, [index, loadedContents]);

  return (
    <Wrapper>
      <ItemImage
        src={media}
        onLoad={() =>
          setLoadedContents((prevContents) => {
            const tempLoadedContents = [...prevContents];
            const targetIndex = Math.floor(index / 5);

            if (
              tempLoadedContents[targetIndex].current <
              tempLoadedContents[targetIndex].maximum
            ) {
              tempLoadedContents[targetIndex] = {
                ...tempLoadedContents[targetIndex],
                current: tempLoadedContents[targetIndex].current + 1,
              };
            }

            return tempLoadedContents;
          })
        }
        $isLoaded={isLoaded}
      />
      <ItemBottomGroup>
        <ItemTextGroup>
          <ItemText title={text.toLowerCase()}>{text.toLowerCase()}</ItemText>
        </ItemTextGroup>
        <ItemButtonGroup>
          <ItemButton
            title={upvoted ? 'Downvote this GIF' : 'Upvote this GIF'}
            $isUpvoted={upvoted}
            onClick={() => {
              if (isClicked) return;

              setIsClicked(true);
              setUpvoted(!upvoted);

              api
                .put(`/update`, {
                  url: media,
                })
                .then(() => setIsClicked(false))
                .catch(() =>
                  toast.error("An error occured while updating GIF's priority.")
                );
            }}
          >
            <UpvoteSVG />
            <p>
              {!isUpvoted && upvoted
                ? upvote + 1
                : isUpvoted && !upvoted
                ? upvote - 1
                : upvote}
            </p>
          </ItemButton>
        </ItemButtonGroup>
      </ItemBottomGroup>
    </Wrapper>
  );
}
