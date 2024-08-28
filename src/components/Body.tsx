import styled from 'styled-components';
import { Item } from './Item';
import { useEffect, useState } from 'react';
import {
  gifListState,
  loadCountState,
  searchQueryState,
  gifSizeState,
} from '../modules/atoms';
import { useRecoilState } from 'recoil';
import { api } from '../configs/axios';
import { SubmissionItem } from './SubmissionItem';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import toast from 'react-hot-toast';

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

const LoadingWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;
`;

const LoadingText = styled.p`
  text-align: center;

  color: var(--brightness-400);
`;

export function Body() {
  const { pathname } = useLocation();
  const { width } = useWindowDimensions();

  const [isReady, setIsReady] = useState<boolean>(false);
  const [onGoingCount, setOnGoingCount] = useState<number>(0);

  const [gifList, setGifList] = useRecoilState(gifListState);
  const [gifSize, setGifSize] = useRecoilState(gifSizeState);
  const [loadCount, setLoadCount] = useRecoilState(loadCountState);
  const [searchQuery] = useRecoilState(searchQueryState);

  useEffect(() => {
    const fetchData = async () => {
      setGifSize(undefined);
      setGifList([]);
      setLoadCount(0);

      const prevPath = pathname;

      await api
        .get(`/size/${pathname === '/submission' ? 'unverified' : 'verified'}`)
        .then((res) => {
          if (prevPath === pathname) {
            setGifSize(res.data.data);
          }
        })
        .catch(() =>
          toast.error('An error occured while getting the size of GIFs.')
        );

      await api
        .get(
          `/load/${
            pathname === '/submission' ? 'unverified' : 'verified'
          }?skip=0`
        )
        .then((res) => {
          if (prevPath === pathname) {
            setGifList(res.data.data);
          }
        })
        .catch(() => []);

      setIsReady(true);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isReady ? undefined : (
        <LoadingWrapper>
          <LoadingText>Loading GIFs... Hold up! 🤫🧏</LoadingText>
        </LoadingWrapper>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={async () => {
          if (onGoingCount === loadCount + 1) {
            return;
          }

          setOnGoingCount(onGoingCount + 1);

          const data = [];

          data.push(
            ...(await api
              .get(
                `/load/${
                  pathname === '/submission' ? 'unverified' : 'verified'
                }?skip=${(loadCount + 1) * 20}`
              )
              .then((res) => res.data.data)
              .catch(() => []))
          );

          setGifList([...gifList, ...(await Promise.all(data)).flat()]);
          setLoadCount(loadCount + 1);
        }}
        hasMore={isReady && gifSize ? (loadCount + 1) * 20 < gifSize : false}
        loader={
          <LoadingWrapper>
            <LoadingText>Loading GIFs... Hold up! 🤫🧏</LoadingText>
          </LoadingWrapper>
        }
      >
        <Wrapper>
          {!isReady ? undefined : gifList.filter(
              (gif) =>
                gif.name.filter((name) => name.includes(searchQuery ?? ''))
                  .length !== 0
            ).length === 0 ? (
            <NotFoundWrapper $isMobile={width <= 1202}>
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
            <InnerWrapper $isMobile={width <= 1202}>
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
                      size={gif.size}
                      upvote={gif.upvote}
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
                      size={gif.size}
                    />
                  )
                )}
            </InnerWrapper>
          )}
        </Wrapper>
      </InfiniteScroll>
    </div>
  );
}
