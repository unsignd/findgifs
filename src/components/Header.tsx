import styled from 'styled-components';
import { ReactComponent as LogoSVG } from '../assets/logo_24.svg';
import { ReactComponent as SearchSVG } from '../assets/search_20.svg';
import { ReactComponent as ArchiveSVG } from '../assets/archive_18.svg';
import { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { useRecoilState } from 'recoil';
import {
  modalActiveState,
  modalIsPromptedState,
  searchQueryState,
} from '../modules/atoms';
import { Modal } from './Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useWindowNavigation from '../hooks/useWindowNavigation';

const Wrapper = styled.div<{
  $isMobile?: boolean;
  $scrolledAmount?: number;
}>`
  width: 100vw;
  height: ${(props) => (props.$isMobile ? 140 : 80)}px;

  position: fixed;

  margin-top: ${(props) =>
    props.$scrolledAmount && props.$scrolledAmount >= 140 ? -60 : 0}px;

  background-color: var(--brightness-100);
  border-bottom: 1px solid var(--brightness-200);

  transition: margin-top 250ms ease;

  z-index: 1;
`;

const InnerWrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: calc(100% - ${(props) => (props.$isMobile ? 40 : 80)}px);
  height: 80px;

  max-width: 1400px;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  justify-content: space-between;
`;

const LogoIcon = styled(LogoSVG)<{
  $isMobile?: boolean;
}>`
  color: var(--brightness-500);

  margin-right: ${(props) => (props.$isMobile ? 40 : 0)}px;

  transition: scale 250ms ease;

  cursor: pointer;

  &:active {
    scale: 0.9;
  }
`;

const ContentGroup = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  gap: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const SearchBar = styled.div<{
  $isMobile?: boolean;
}>`
  width: ${(props) =>
    props.$isMobile ? 'calc(100% - 40px)' : 'calc(360px - 24px)'};
  height: 40px;

  display: flex;
  align-items: center;

  margin-top: ${(props) => (props.$isMobile ? 80 : 0)}px;
  margin-right: ${(props) => (props.$isMobile ? 0 : 40)}px;
  margin-left: ${(props) => (props.$isMobile ? 20 : 0)}px;
  padding: 0 12px;

  background-color: var(--brightness-200);
  border-radius: ${(props) => (props.$isMobile ? 6 : 20)}px;
`;

const SearchIcon = styled(SearchSVG)`
  color: var(--brightness-400);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;

  margin-left: 8px;

  &::placeholder,
  &::-webkit-input-placeholder {
    color: var(--brightness-400);
  }

  &:-ms-input-placeholder {
    color: var(--brightness-400);
  }
`;

const Button = styled.button<{
  $border?: boolean;
}>`
  height: 40px;

  display: flex;
  align-items: center;

  padding: 0 17.5px;

  background-color: ${(props) =>
    props.$border ? 'var(--brightness-100)' : 'none'};
  border: ${(props) =>
    props.$border ? '1px solid var(--brightness-300)' : 'none'};
  border-radius: ${(props) => (props.$border ? 20 : 0)}px;

  cursor: ${(props) => (props.$border ? 'pointer' : 'auto')};

  & p {
    cursor: pointer;
  }

  & p:hover {
    text-decoration: ${(props) => (props.$border ? 'none' : 'underline')};
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: -30px;

  background-color: var(--brightness-100);
  border: 1px solid var(--brightness-300);
  border-radius: 20px;

  cursor: pointer;
`;

export function Header() {
  const { pathname } = useLocation();
  const { width } = useWindowDimensions();
  const { scrolledAmount } = useWindowNavigation();
  const navigate = useNavigate();

  const [modalStyles, setModalStyles] = useState({
    overlay: {
      backgroundColor: 'var(--overlay)',

      zIndex: 1,
    },
    content: {
      width: 500,
      height: 329,

      maxWidth: 'calc(100vw - 40px)',

      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',

      padding: 0,

      border: 'none',
      borderRadius: 12,

      transition: 'height 250ms ease',
    },
  });

  const [isActive, setIsActive] = useRecoilState(modalActiveState);
  const [isPrompted] = useRecoilState(modalIsPromptedState);
  const [, setSearchQuery] = useRecoilState(searchQueryState);

  const searchRef: {
    current: any;
  } = useRef(null);

  useEffect(() => {
    setModalStyles({
      ...modalStyles,
      content: {
        ...modalStyles.content,
        height: isActive && isPrompted ? 518 : 329,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPrompted]);

  if (width > 1202) {
    return (
      <Wrapper>
        <InnerWrapper>
          <ContentGroup>
            <LogoIcon onClick={() => navigate('/')} />
            <SearchBar>
              <SearchIcon />
              <SearchInput
                placeholder={
                  pathname === '/submission'
                    ? 'Search submissions...'
                    : 'Search GIFs...'
                }
                onChange={(event) =>
                  setSearchQuery(
                    !event.target.value || event.target.value === ''
                      ? null
                      : event.target.value
                  )
                }
                ref={searchRef}
              />
            </SearchBar>
          </ContentGroup>
          <ContentGroup>
            <ButtonGroup>
              <Button onClick={() => navigate('/submission')}>
                <p>Submission List</p>
              </Button>
              <Button>
                <a
                  href="https://instagram.com/_findgifs"
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>Official Instagram</p>
                </a>
              </Button>
            </ButtonGroup>
            <Button $border onClick={() => setIsActive(true)}>
              <p>Share GIFs</p>
            </Button>
          </ContentGroup>
        </InnerWrapper>
        <ReactModal
          closeTimeoutMS={100}
          isOpen={isActive}
          onRequestClose={() => setIsActive(false)}
          style={modalStyles}
        >
          <Modal />
        </ReactModal>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper $isMobile $scrolledAmount={scrolledAmount}>
        <InnerWrapper $isMobile>
          <ContentGroup>
            <LogoIcon $isMobile onClick={() => navigate('/')} />
          </ContentGroup>
          <ContentGroup>
            <IconButton
              title="View Submission list"
              onClick={() => navigate('/submission')}
            >
              <ArchiveSVG />
            </IconButton>
            <Button $border onClick={() => setIsActive(true)}>
              <p>Share GIFs</p>
            </Button>
          </ContentGroup>
        </InnerWrapper>
        <SearchBar $isMobile>
          <SearchIcon />
          <SearchInput
            placeholder={
              pathname === '/submission'
                ? 'Search submissions...'
                : 'Search GIFs...'
            }
            onChange={(event) =>
              setSearchQuery(
                !event.target.value || event.target.value === ''
                  ? null
                  : event.target.value
              )
            }
            ref={searchRef}
          />
        </SearchBar>
        <ReactModal
          closeTimeoutMS={100}
          isOpen={isActive}
          onRequestClose={() => setIsActive(false)}
          style={modalStyles}
        >
          <Modal />
        </ReactModal>
      </Wrapper>
    );
  }
}
