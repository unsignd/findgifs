import styled from 'styled-components';
import { Item } from './Item';
import { useEffect, useState } from 'react';
import {
  gifListState,
  loadedContentState,
  searchQueryState,
} from '../modules/atoms';
import { useRecoilState } from 'recoil';
import { api } from '../configs/axios';
import { SubmissionItem } from './SubmissionItem';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useLocation } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;

  background-color: var(--brightness-100);
`;

const InnerWrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: calc(100% - ${(props) => (props.$isMobile ? 40 : 80)}px);
  height: 100%;

  max-width: 1400px;

  display: grid;
  align-items: end;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-gap: 40px;

  padding: 40px 0;
`;

const NotFoundWrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: calc(100% - ${(props) => (props.$isMobile ? 40 : 80)}px);
  height: 100%;

  max-width: 1400px;

  display: flex;
  justify-content: center;

  padding: 40px 0;
`;

const NotFoundGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const NotFoundImage = styled.img`
  width: 240px;
`;

const NotFoundText = styled.p`
  text-align: center;
  /* line-height: 1.2; */
  white-space: pre;

  color: var(--brightness-400);
`;

export function Body() {
  const { pathname } = useLocation();
  const { width } = useWindowDimensions();

  const [isReady, setIsReady] = useState<boolean>(false);

  const [gifList, setGifList] = useRecoilState(gifListState);
  const [loadedContents, setLoadedContents] =
    useRecoilState(loadedContentState);
  const [searchQuery] = useRecoilState(searchQueryState);

  useEffect(() => {
    setGifList([]);
    setLoadedContents(0);

    console.log(pathname);

    api
      .get(`/load/${pathname === '/submission' ? 'unverified' : 'verified'}`)
      .then((res) => {
        setGifList(res.data.data);
        setIsReady(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady && gifList.length !== 0 && loadedContents === gifList.length) {
      setLoadedContents(-1);
    }
  }, [isReady, gifList, loadedContents, setLoadedContents]);

  return (
    <Wrapper>
      {!isReady ? undefined : gifList.filter(
          (gif) =>
            gif.name.filter((name) => name.includes(searchQuery ?? ''))
              .length !== 0
        ).length === 0 ? (
        <NotFoundWrapper $isMobile={width <= 1040}>
          <NotFoundGroup>
            <NotFoundImage
              src={require('../assets/404.png')}
              draggable={false}
            />
            <NotFoundText>
              {gifList.length === 0
                ? `No ${
                    pathname === '/submission' ? 'submissions' : 'GIFs'
                  } have been submitted yet.\nWhat if you give it a try? ⛏️😙`
                : 'No GIFs containing the search term were found.'}
            </NotFoundText>
          </NotFoundGroup>
        </NotFoundWrapper>
      ) : (
        <InnerWrapper $isMobile={width <= 1040}>
          {gifList
            .filter(
              (gif) =>
                gif.name.filter((name) => name.includes(searchQuery ?? ''))
                  .length !== 0
            )
            .map((gif, index) =>
              pathname === '/submission' ? (
                <SubmissionItem
                  key={index}
                  media={gif.url}
                  text={
                    gif.name.filter((name) =>
                      name.includes(searchQuery ?? '')
                    )[0]
                  }
                  upvote={Object.keys(gif.upvote).length}
                  isUpvoted={gif.isUpvoted!}
                />
              ) : (
                <Item
                  key={index}
                  media={gif.url}
                  text={
                    gif.name.filter((name) =>
                      name.includes(searchQuery ?? '')
                    )[0]
                  }
                />
              )
            )}
        </InnerWrapper>
      )}
    </Wrapper>
  );
}
